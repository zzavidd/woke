import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { socialPlatforms } from 'constants/settings.js';
import css from 'styles/components/Icon.module.scss';

export class Icon extends Component {
  render() {
    const { prefix, name, color, style, className, width, height } = this.props;
    return (
      <FontAwesomeIcon
        icon={[prefix || 'fas', name]}
        color={color || 'white'}
        style={{ marginRight: '0.4em', ...style }}
        className={className}
        width={width}
        height={height}
      />
    );
  }
}

/** Header social media icons */
export class HeaderIcon extends Component {
  render() {
    return (
      <SocialIcon
        icon={this.props.icon}
        href={this.props.href}
        className={css.header_socials}
      />
    );
  }
}

/** Footer social media icons */
export class FooterIcon extends Component {
  render() {
    return (
      <div className={css.footer_socials}>
        <SocialIcon icon={this.props.icon} href={this.props.href} size={'3x'} />
      </div>
    );
  }
}

/** Bar of mini icons for social promotion on profiles */
export class PromoIconsBar extends Component {
  render() {
    const socials = JSON.parse(this.props.socials);

    const renderIcons = () => {
      const items = [];

      if (socials) {
        for (const [index, item] of Object.entries(socials)) {
          if (item && item !== '') {
            let social = socialPlatforms[index];
            if (!social) return;
            items.push(
              <SocialIcon
                key={index}
                className={css.promo_socials}
                icon={social.icon}
                href={`${social.domain}${item}`}
                {...this.props}
              />
            );
          }
        }
      }
      return items;
    };

    return <div className={css.promo_bar}>{renderIcons()}</div>;
  }
}

export class _SocialsList extends Component {
  render() {
    const listSocials = (socials) => {
      if (!socials) return null;

      const items = [];
      for (const [idx, item] of Object.entries(socials)) {
        if (item && item !== '') {
          let social = socialPlatforms[idx];
          if (!social) return;

          let link = `${social.domain}${item}`;
          items.push(
            <div key={idx} className={css[`socials-${theme}`]}>
              {social.name}:
              <a href={link} target={'_blank'} rel={'noopener noreferrer'}>
                {social.domain ? `@${item}` : link}
              </a>
            </div>
          );
        }
      }

      return items;
    };

    const { theme, socials } = this.props;

    return <div className={'mt-2'}>{listSocials(socials)}</div>;
  }
}

export const MaleSymbol = () => {
  return <Icon name={'mars'} color={'aqua'} />;
};

export const FemaleSymbol = () => {
  return <Icon name={'venus'} color={'pink'} />;
};

/** Template for social icons */
class _SocialIcon extends Component {
  constructor() {
    super();
    this.state = { isLoaded: false };
  }

  componentDidMount() {
    this.setState({ isLoaded: true });
  }

  render() {
    if (!this.state.isLoaded) return null;

    const { theme, icon, size, href, className } = this.props;

    return (
      <a target={'_blank'} href={href} className={className}>
        <FontAwesomeIcon
          icon={['fab', icon]}
          className={css[`socialIcon-${theme}`]}
          size={size}
        />
      </a>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme
});

export const SocialsList = connect(mapStateToProps)(_SocialsList);
export const SocialIcon = connect(mapStateToProps)(_SocialIcon);
