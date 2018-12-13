/*
 * Wazuh app - Management groups controller
 * Copyright (C) 2018 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import beautifier from '../../utils/json-beautifier';
import * as FileSaver from '../../services/file-saver';

export function GroupsController(
  $scope,
  $location,
  apiReq,
  errorHandler,
  csvReq,
  appState,
  shareAgent,
  wzTableFilter
) {
  $scope.$on('groupsIsReloaded', () => {
    $scope.currentGroup = false;
    $scope.lookingGroup = false;
    if (!$scope.$$phase) $scope.$digest();
  });

  $scope.load = true;

  /**
   * Get full data on CSV format from a path
   * @param {String} data_path path with data to convert
   */
  $scope.downloadCsv = async data_path => {
    try {
      errorHandler.info('Your download should begin automatically...', 'CSV');
      const currentApi = JSON.parse(appState.getCurrentAPI()).id;
      const output = await csvReq.fetch(
        data_path,
        currentApi,
        wzTableFilter.get()
      );
      const blob = new Blob([output], { type: 'text/csv' }); // eslint-disable-line

      FileSaver.saveAs(blob, 'groups.csv');

      return;
    } catch (error) {
      errorHandler.handle(error, 'Download CSV');
    }
    return;
  };

  /**
   * This perfoms a search by a given term
   * @param {String} term
   */
  $scope.search = term => {
    $scope.$broadcast('wazuhSearch', { term });
  };

  // Store a boolean variable to check if come from agents
  const globalAgent = shareAgent.getAgent();

  /**
   * This load at init some required data
   */
  const load = async () => {
    try {
      // If come from agents
      if (globalAgent) {
        const globalGroup = shareAgent.getSelectedGroup();
        // Get ALL groups
        const data = await apiReq.request('GET', '/agents/groups/', {
          limit: 1000
        });

        const filtered = data.data.data.items.filter(
          group => group.name === globalGroup
        );

        if (Array.isArray(filtered) && filtered.length) {
          // Load that our group
          $scope.loadGroup(filtered[0], true);
          $scope.lookingGroup = true;
        } else {
          throw Error(`Group ${globalGroup} not found`);
        }

        shareAgent.deleteAgent();
      }

      $scope.load = false;

      if (!$scope.$$phase) $scope.$digest();
    } catch (error) {
      errorHandler.handle(error, 'Groups');
    }
    return;
  };

  load();

  $scope.toggle = () => ($scope.lookingGroup = true);

  /**
   * This navigate to a selected agent
   */
  $scope.showAgent = agent => {
    shareAgent.setAgent(agent);
    $location.search('tab', null);
    $location.path('/agents');
  };

  /**
   * This load the group information to a given agent
   */
  $scope.loadGroup = async (group, firstTime) => {
    try {
      if (!firstTime) $scope.lookingGroup = true;
      const count = await apiReq.request(
        'GET',
        `/agents/groups/${group.name}/files`,
        { limit: 1 }
      );
      $scope.totalFiles = count.data.data.totalItems;
      $scope.fileViewer = false;
      $scope.currentGroup = group;
      $scope.fileViewer = false;
      if (!$scope.$$phase) $scope.$digest();
    } catch (error) {
      errorHandler.handle(error, 'Groups');
    }
    return;
  };

  //listeners
  $scope.$on('wazuhShowGroup', (event, parameters) => {
    return $scope.loadGroup(parameters.group);
  });

  $scope.$on('wazuhShowGroupFile', (event, parameters) => {
    return $scope.showFile(parameters.groupName, parameters.fileName);
  });

  /**
   * This navigate back to agents overview
   */
  $scope.goBackToAgents = () => {
    $scope.groupsSelectedTab = 'agents';
    $scope.file = false;
    $scope.filename = false;
    if (!$scope.$$phase) $scope.$digest();
  };

  /**
   * This navigate back to files
   */
  $scope.goBackFiles = () => {
    $scope.groupsSelectedTab = 'files';
    $scope.file = false;
    $scope.filename = false;
    $scope.fileViewer = false;
    if (!$scope.$$phase) $scope.$digest();
  };

  /**
   * This navigate back to groups
   */
  $scope.goBackGroups = () => {
    $scope.currentGroup = false;
    $scope.lookingGroup = false;
    if (!$scope.$$phase) $scope.$digest();
  };

  /**
   * This show us a group file, for a given group and file
   */
  $scope.showFile = async (groupName, fileName) => {
    try {
      if ($scope.filename) $scope.filename = '';
      if (fileName === '../ar.conf') fileName = 'ar.conf';
      $scope.fileViewer = true;
      const tmpName = `/agents/groups/${groupName}/files/${fileName}`;
      const data = await apiReq.request('GET', tmpName, {});
      $scope.file = beautifier.prettyPrint(data.data.data);
      $scope.filename = fileName;

      if (!$scope.$$phase) $scope.$digest();
    } catch (error) {
      errorHandler.handle(error, 'Groups');
    }
    return;
  };

  // Resetting the factory configuration
  $scope.$on('$destroy', () => {});

  $scope.$watch('lookingGroup', value => {
    if (!value) {
      $scope.file = false;
      $scope.filename = false;
    }
  });
}
