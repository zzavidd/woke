import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '~/constants/theme.js';

import css from '~/styles/_components.scss';

export class Icon extends Component {
  render(){
    return (
      <FontAwesomeIcon
        icon={['fas', this.props.name]}
        color={this.props.color || 'white'}
        style={{ marginRight: '0.4em' }} />
    ) 
  }
}

/** Header social media icons */
export class HeaderIcon extends Component {
  constructor(){
    super();
    this.state = { isLoaded: false }
  }

  componentDidMount(){
    this.setState({ isLoaded: true });
  }

  render(){
    if (this.state.isLoaded){
      return (
        <a
          href={this.props.href}
          style={{fontSize: 24}}>
          <FontAwesomeIcon
            icon={['fab', this.props.icon]}
            color={colors.primary}
            style={{margin: '0 3px'}} />
        </a>
      )
    } else {
      return null;
    }
  }
}

/** Footer social media icons */
export class FooterIcon extends Component {
  constructor(){
    super();
    this.state = {
      isLoaded: false
    }
  }

  componentDidMount(){
    this.setState({ isLoaded: true });
  }

  render(){
    if (this.state.isLoaded){
      return (
        <div className={css.footer_socials}>
          <a href={this.props.href}>
            <FontAwesomeIcon
              icon={["fab", this.props.icon]}
              color={colors.primary}
              size={'3x'} />
          </a>
        </div>
      )
    } else {
      return null;
    }
   
  }
}