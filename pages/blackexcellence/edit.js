import React, { Component} from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { formatISODate } from '~/constants/date.js';
import { generateSlug, generateCandidateFilename } from '~/constants/file.js';
import { isValidCandidate } from '~/constants/validations.js';

import CandidateForm from './form.js';
import CLEARANCES from '~/constants/clearances';

class CandidateEdit extends Component {
  static async getInitialProps({ query }) {
    return { candidate: query.candidate };
  }

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      occupation: '',
      birthday: new Date(2000, 0, 1),
      description: '',
      image: '',
      imageChanged: false,
      ethnicity1: '',
      ethnicity2: '',
      ethnicity3: '',
      ethnicity4: '',
      socials: {}
    };
  }

  componentDidMount(){
    const { id, name, occupation, image, birthday, description, ethnicity, socials } = this.props.candidate;

    this.setState({
      id: id,
      name: name,
      occupation: occupation,
      birthday: new Date(birthday),
      description: description,
      image: image,
      socials: JSON.parse(socials)
    }, () => {
      const ethnicities = JSON.parse(ethnicity);
      if (ethnicities){
        this.setState({
          ethnicity1: ethnicities[0] || '',
          ethnicity2: ethnicities[1] || '',
          ethnicity3: ethnicities[2] || '',
          ethnicity4: ethnicities[3] || '',
        })
      }
    })
  }

  /** Handle text changes */
  handleText = (event) => {
    const { name, value } = event.target;
    this.setState({[name]: value}); }
  handleDate = (birthday) => { this.setState({birthday}); }
  handleImage = (event) => { this.setState({image: event.target.files[0], imageChanged: true}); }
  confirmSocials = (socials) => {this.setState({socials})}

  clearSelection = (name) => { this.setState({[name]: ''})}

  /** Update session details */
  updateCandidate = () => {
    if (!isValidCandidate(this.state)) return;
    
    const { id, name, occupation, image, birthday, description, socials,
      ethnicity1, ethnicity2, ethnicity3, ethnicity4, imageChanged } = this.state;

    /** Generate slugs and filenames from name and data */
    let slug = generateSlug(name);
    let filename = imageChanged ? generateCandidateFilename(id, slug, image) : image

    /** Add ethncities to array */
    const ethnicities = [];
    if (ethnicity1) ethnicities.push(ethnicity1);
    if (ethnicity2) ethnicities.push(ethnicity2);
    if (ethnicity3) ethnicities.push(ethnicity3);
    if (ethnicity4) ethnicities.push(ethnicity4);
    
    const candidates = {
      candidate1: this.props.candidate,
      candidate2: {
        id: id,
        name: name.trim(),
        occupation: occupation.trim(),
        image: filename,
        birthday: formatISODate(birthday),
        ethnicity: JSON.stringify(ethnicities),
        description: description,
        socials: JSON.stringify(socials)
      }
    };

    const data = new FormData();
    data.append('candidates', JSON.stringify(candidates));
    data.append('changed', imageChanged);
    imageChanged && data.append('file', image, filename);

    /** Update candidate in database */
    fetch('/updateCandidate', {
      method: 'PUT',
      body: data,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`,
        'Clearance': CLEARANCES.ACTIONS.CRUD_BLACKEX,
        'Path': 'blackexcellence'
      }
    }).then(res => {
      if (res.ok){
        Router.push(`/blackexcellence/candidate/${id}`);
      } else {
        console.log(res);
      }
    }).catch(error => console.error(error));
  }

  render(){
    return (
      <CandidateForm
        heading={'Edit Candidate'}
        candidate={this.state}
        handleText={this.handleText}
        handleDate={this.handleDate}
        handleImage={this.handleImage}

        confirmSocials={this.confirmSocials}
        clearSelection={this.clearSelection}

        confirmText={'Update'}
        confirmFunc={this.updateCandidate}
        cancelFunc={Router.back}

        metaTitle={'Edit Candidate'}
        metaUrl={'/edit'} />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(CandidateEdit);