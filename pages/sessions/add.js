import React, { Component} from 'react';
import Router from 'next/router';
import { formatISODate } from '~/constants/date.js';
import { generateSlug, generateSessionFilename } from '~/constants/file.js';
import { isValidSession } from '~/constants/validations.js';

import SessionForm from './form.js';

export default class SessionAdd extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      date: new Date(),
      description: '',
      image: null
    };
  }
 
  /** Handle session detail changes */
  handleTitle = (event) => { this.setState({title: event.target.value}); }
  handleDate = (date) => { this.setState({date}); }
  handleDescription = (event) => { this.setState({description: event.target.value}); }
  handleImage = (event) => { this.setState({image: event.target.files[0]}); }

  /** POST session to the server */
  submitSession = () => {
    if (!isValidSession(this.state)) return;
    
    const { title, date, description, image } = this.state;

    /** Generate slugs and filenames from title and data */
    let slug = generateSlug(title);
    let filename = generateSessionFilename(date, slug, image);
    
    const session = {
      title: title.trim(),
      dateHeld: formatISODate(date),
      description: description.trim(),
      slug: slug,
      image: filename
    };

    const data = new FormData();
    data.append('session', JSON.stringify(session));
    data.append('file', image, filename);

    /** Add session to database */
    fetch('/addSession', {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': 'authorized',
        'Path': 'sessions'
      }
    }).then(res => {
      if (res.ok) Router.push('/sessions');
    }).catch(error => console.error(error));
  }

  render(){
    return (
      <SessionForm
        heading={'Add New Session'}
        session={this.state}
        handleTitle={this.handleTitle}
        handleDate={this.handleDate}
        handleDescription={this.handleDescription}
        handleImage={this.handleImage}

        confirmText={'Submit'}
        confirmFunc={this.submitSession}
        cancelFunc={() => Router.push('/sessions')}

        metaTitle={'Add New Session'}
        metaUrl={'/add'} />
    );
  }
}