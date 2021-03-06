import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Divider } from 'components/text.js';
import { copyright, emails } from 'constants/settings.js';
import css from 'styles/Partials.module.scss';

export default class Footer extends Component {
  constructor() {
    super();
    this.state = { isLoaded: false };
  }

  componentDidMount() {
    this.setState({ isLoaded: true });
  }

  render() {
    if (!this.state.isLoaded) return null;

    return (
      <div className={css.footer}>
        <Divider />
        <Row>
          <Links />
        </Row>
      </div>
    );
  }
}

/** Links for all necessary */
class Links extends Component {
  render() {
    return (
      <React.Fragment>
        <Col className={css.footerLinks} md={6} lg={9}>
          <a href={'/about'}>About Us</a>
          <a href={'/recruitment'}>Recruitment</a>
          <a href={'/spotify'}>The #WOKEWeekly Podcast</a>
          <a href={'/privacy'}>Privacy Policy</a>
          <a href={'/cookies'}>Cookies</a>
          <a href={'/faq'}>FAQs</a>
          <a href={'/donate'}>Donate</a>
          <a href={`mailto: ${emails.enquiries}`}>Contact Us</a>
        </Col>
        <Col className={css.author} md={6} lg={3}>
          {copyright}. All rights reserved.
        </Col>
      </React.Fragment>
    );
  }
}
