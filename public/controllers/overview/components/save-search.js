import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
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
        window.alert(`${this.state.searchName} will be saved`);
        this.setState({ isModalVisible: false });
        this.setState({ searchName: false });
        console.log('search: ', this.props.query)
      } else {
        window.alert('Cannot save withou a name.')
      }

    } catch (error) {
      console.error('Cannot save the search ', error);
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

    let modal;

    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal onClose={() => this.closeModal()}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>Save the search</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>{form}</EuiModalBody>

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
  query: PropTypes.string
};