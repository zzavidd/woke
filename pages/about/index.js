import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import CLEARANCES from '~/constants/clearances.js';

import { EditButton } from '~/components/button.js';
import { Shader, Spacer } from '~/components/layout.js';
import { Paragraph } from '~/components/text.js';
import { BottomToolbar } from '~/components/toolbar.js';

import css from '~/styles/about.scss';

class About extends Component {
  /** Retrieve about description from server */
  static async getInitialProps({ query }) {
    return { text: query.description };
  }

  constructor(){
    super();
    this.state = { isLoaded: false }
  }

  componentDidMount(){
    this.setState({ isLoaded: true })
  }

  render(){
    const { isLoaded } = this.state;
    const { user, text } = this.props;

    if (!isLoaded) return null;

    return (
      <Spacer>
        <Shader>
          <div className={css.container}>
            <Paragraph className={css.text}>{text}</Paragraph>
          </div>
        </Shader>

        {user.clearance >= CLEARANCES.ACTIONS.EDIT_ABOUT ? 
          <BottomToolbar>
            <EditButton
              title={'Edit Text'}
              onClick={() => Router.push('/about/edit/')} />
          </BottomToolbar>
        : null}
      </Spacer>
    );
  
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(About);