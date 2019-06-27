import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  EuiIcon,
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';

export class SaveSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      searchName: false
    };
  }

  initVarsAgain() {
    Object.keys(this.state).map(k => {
      this.state[k] = false;
    });
  }

  closeModal() {
    this.setState({ isModalVisible: false });
  }

  showSaveModal() {
    this.setState({ isModalVisible: true });
  }

  showOpenModal() {
    this.setState({ isModalVisible: true });
  }

  saveSearch() {
    try {
      //TODO save the search
      if (this.state.searchName) {
        this.props.savedSearch()
        this.closeModal()
      } else {
        this.setState({ noSearchName: true });
      }
      //this.initVarsAgain()
    } catch (error) {
      this.props.handleError(error)
    }
  }

  // Listening the input
  onChange = e => {
    this.setState({ searchName: e.target.value });
  };

  render() {

    const form = (
      <EuiForm>
        <EuiFormRow label="Search name">
          <EuiFieldText onChange={e => this.onChange(e)} name="searchName" />
        </EuiFormRow>
      </EuiForm>
    );

    let noSearchNameSet;
    let modal;
    
    if (this.state.noSearchName) {
      noSearchNameSet = (
        <div class="noSearchName">
          <p><EuiIcon type="alert" />&nbsp;Please insert a name to save the search.</p>
        </div>)
    }

    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal onClose={() => this.closeModal()}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>Save the search</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>{form}</EuiModalBody>
            {noSearchNameSet}
            <EuiModalFooter>
              <EuiButtonEmpty onClick={() => this.closeModal()}>Cancel</EuiButtonEmpty>
              <EuiButton onClick={() => this.saveSearch()} fill>
                Save
            </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }

    return (
      <div>
        <EuiButtonEmpty onClick={() => this.showSaveModal()}>
          <b>Save</b>
        </EuiButtonEmpty>
        <EuiButtonEmpty onClick={() => this.showOpenModal()}>
          <b>Open</b>
        </EuiButtonEmpty>
        {modal}
      </div>
    );
  }
}

SaveSearch.propTypes = {
  savedSearch: PropTypes.func,
  handleError: PropTypes.func
};