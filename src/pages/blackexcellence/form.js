import React, { Component} from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SubmitButton, CancelButton, AddEntityButton } from '~/components/button.js';
import { EventDatePicker, BirthdayPicker } from '~/components/datepicker.js';
import { Heading, Group, Label, TextInput, Select, ClickInput, NumberPicker, LongTextArea, FileSelector } from '~/components/form.js';
import { SocialsList } from '~/components/icon.js';
import { Shader, Spacer } from '~/components/layout.js';
import { EthnicModal, SocialsModal } from '~/components/modal.js';

import { countriesToString } from '~/constants/countries.js';
import CLEARANCES from '~/constants/clearances.js';
import { getFilename } from '~/private/filer.js';
import request from '~/constants/request.js';

import css from '~/styles/blackex.scss';

class CandidateForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      ethnicModalVisible: false,
      socialsModalVisible: false,
      members: []
    }

    if (props.user.clearance < CLEARANCES.ACTIONS.CRUD_SESSIONS){
      return location.href = '/blackexcellence';
    }
  }

  componentDidMount(){
    request({
      url: '/getTeam',
      method: 'GET',
      headers: {
        'Admission': true,
        'Content-Type': 'application/json',
      },
      onSuccess: (response) => {
        const members = [];
        response.forEach(member => {
          members.push({value: member.id, label: `${member.firstname} ${member.lastname}` })
        });
        members.sort((a, b) => {
          a = a.label;
          b = b.label;
          return a < b ? -1 : a > b ? 1 : 0;
        });
        this.setState({ members});
      }
    });
  }

  showEthnicModal = () => { this.setState({ ethnicModalVisible: true})}
  hideEthnicModal = () => { this.setState({ ethnicModalVisible: false})}
  showSocialsModal = () => { this.setState({ socialsModalVisible: true})}
  hideSocialsModal = () => { this.setState({ socialsModalVisible: false})}

  render(){
    const { heading, confirmText, confirmFunc, cancelFunc, handlers, countries } = this.props;
    const { handleText, handleBirthday, handleDateWritten, handleImage, clearSelection, confirmSocials, } = handlers;

    const { id, name, description, occupation, birthday, image, socials,
      ethnicity1, ethnicity2, ethnicity3, ethnicity4,
      authorId, date_written } = this.props.candidate;

    const { members, ethnicModalVisible, socialsModalVisible } = this.state;

    const filename = getFilename(image);
    const ethnicities = countriesToString([ethnicity1, ethnicity2, ethnicity3, ethnicity4], countries);    

    return (
      <Shader>
        <Spacer className={css.form}>
          <div>
            <Heading>{heading}</Heading>

            <Group>
              <Col md={6}>
                <Label>Name:</Label>
                <TextInput
                  name={'name'}
                  value={name}
                  onChange={handleText}
                  placeholder={"Enter candidate's name."} />
              </Col>
              <Col md={2}>
                <Label>Number:</Label>
                <NumberPicker
                  name={'id'}
                  value={id}
                  onChange={handleText}
                  placeholder={"ID No."} />
              </Col>
              <Col md={4}>
                <Label>Birthday:</Label>
                <BirthdayPicker date={birthday} onConfirm={handleBirthday} />
              </Col>
            </Group>
            <Group>
              <Col md={5}>
                <Label>Occupation:</Label>
                <TextInput
                  name={'occupation'}
                  value={occupation}
                  onChange={handleText}
                  placeholder={"Enter candidate's occupation."} />
              </Col>
              <Col md={7}>
                <Label>Ethnic Origin:</Label>
                <ClickInput
                  onClick={this.showEthnicModal}
                  value={ethnicities}
                  placeholder={'Click to select countries of origin...'} />
              </Col>
            </Group>
            <Group>
              <Col md={12}>
                <Label>Socials:</Label>
                <AddEntityButton
                  title={'Add Socials'}
                  onClick={this.showSocialsModal} />
                <SocialsList socials={socials} />
              </Col>
            </Group>
            <Group>
              <Col>
                <Label>Description:</Label>
                <LongTextArea
                  name={'description'}
                  value={description}
                  onChange={handleText}
                  placeholder={"Write out candidate tribute..."} />
              </Col>
            </Group>
            <Group>
              <Col md={5}>
                <Label>Author:</Label>
                <Select
                  name={'authorId'}
                  value={authorId}
                  placeholder={'Select the author.'}
                  items={members}
                  onChange={handleText} />
                </Col>
                <Col md={{span: 5, offset: 2}}>
                  <Label>Date Written:</Label>
                  <EventDatePicker date={date_written} onConfirm={handleDateWritten} />
                </Col>
            </Group>
            <Group>
              <Col>
                <FileSelector
                  filename={filename}
                  directory={`blackexcellence`}
                  onChange={handleImage} />
              </Col>
            </Group>
          </div>

          <div>
            <Group>
              <Col>
                <SubmitButton onClick={confirmFunc} className={'mr-2'}>{confirmText}</SubmitButton>
                <CancelButton onClick={cancelFunc}>Cancel</CancelButton>
              </Col>
            </Group>
          </div>
        </Spacer>

        <EthnicModal
          visible={ethnicModalVisible}
          entity={this.props.candidate}
          handleSelect={handleText}
          clearSelection={clearSelection}
          close={this.hideEthnicModal} />

        <SocialsModal
          visible={socialsModalVisible}
          socials={socials}
          handleText={handleText}
          confirm={confirmSocials}
          close={this.hideSocialsModal} />
      </Shader>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  countries: state.countries
});

export default connect(mapStateToProps)(CandidateForm);