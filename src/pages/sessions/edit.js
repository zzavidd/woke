import React, { Component} from 'react';
import { connect } from 'react-redux';

import { setAlert } from '~/components/alert.js';

import { formatISODate } from '~/constants/date.js';
import handlers from '~/constants/handlers.js';
import request from '~/constants/request.js';
import { isValidSession } from '~/constants/validations.js';

import SessionForm from './form.js';

class SessionEdit extends Component {
  static async getInitialProps({ query }) {
    return { session: query.session };
  }

  constructor(props) {
    super(props);
    this.state = {
      title: props.session.title,
      date: new Date(props.session.dateHeld),
      description: props.session.description,
      image: props.session.image
    };
  }

  /** Update session details */
  updateSession = () => {
    if (!isValidSession(this.state)) return;
    
    const { title, date, description, image } = this.state;
    const changed = !image.startsWith("v");

    const data = JSON.stringify({
      session1: this.props.session,
      session2: {
        title: title.trim(),
        dateHeld: formatISODate(date),
        description: description.trim(),
        image: image
      },
      changed
    });

    /** Update session in database */
    request({
      url: '/updateSession',
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${this.props.user.token}`, },
      onSuccess: ({slug}) => {
        setAlert({ type: 'success', message: `You've successfully edited the details of ${title}.` });
        location.href = `/session/${slug}`;
      }
    });
  }

  render(){
    const { slug } = this.props.session;
    return (
      <SessionForm
        heading={'Edit Session'}
        session={this.state}
        handlers={handlers(this)}

        confirmText={'Update'}
        confirmFunc={this.updateSession}
        cancelFunc={() => location.href = `/session/${slug}`}

        metaTitle={'Edit Session'}
        metaUrl={'/edit'} />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(SessionEdit);