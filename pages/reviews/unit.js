import React, { PureComponent } from 'react';
import { Col, Row, Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import { setAlert } from '~/components/alert.js';
import { ConfirmModal } from '~/components/modal.js';
import { Title, Subtitle, Divider, Paragraph, truncateText } from '~/components/text.js';
import { Slider } from '~/components/transitioner.js';
import Rator from '~/components/rator.js';

import CLEARANCES from '~/constants/clearances.js';
import request from '~/constants/request.js';

import css from '~/styles/home.scss';

class Review extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      modalVisible: false
    }
  }

  componentDidMount(){
    this.setState({isLoaded: true});
  }
  
  /** Delete review from database */
  deleteReview = () => {
    const { item, user } = this.props;
    const review = item;
    request({
      url: '/deleteReview',
      method: 'DELETE',
      body: JSON.stringify(item),
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      onSuccess: () => {
        setAlert({ type: 'success', message: `You've successfully deleted ${review.referee}'s review.` });
        location.href = '/reviews';
      }
    });
  }

  /** Show and hide confirmation modal */
  showModal = () => { this.setState({modalVisible: true})}
  hideModal = () => { this.setState({modalVisible: false})}

  render(){
    const { item, idx, fullText, user } = this.props;
    item.description = item.description && item.description.trim().length > 0 ? item.description : 'No description.';

    const isEven = (idx % 2 == 0);

    const ReviewerImage = () => {
      if (!item.image) return null;
      return (
        <img
          src={`/static/images/reviews/${item.image}`}
          alt={item.fullname}
          className={css.image} />
      );
    }

    return (
      <React.Fragment>
        <Slider
          key={idx}
          determinant={this.state.isLoaded}
          duration={750}
          delay={1000 + (500 * idx)}
          direction={isEven ? 'left' : 'right'}>
          <div className={css.item}>
            <Row>
              <Col md={{span: 3, order: isEven ? 1 : 2}}>
                <ReviewerImage/>
              </Col>
              <Col md={{span: 9, order: isEven ? 2 : 1}}>
                <div className={css.details}>
                  <Title className={css.title}>{item.referee}</Title>
                  <Subtitle className={css.subtitle}>{item.position}</Subtitle>
                  <Rator rating={item.rating} changeable={false} />
                  <Divider />
                  <Paragraph
                    className={css.paragraph}>
                    {fullText ? item.description : truncateText(item.description, 60)}
                  </Paragraph>
                </div>
                {user.clearance >= CLEARANCES.ACTIONS.CRUD_REVIEWS ?
                  <ButtonGroup className={css.buttons}>
                    <Button variant={'success'} onClick={() => location.href = (`/reviews/edit/${item.id}`)}>Edit</Button>
                    <Button variant={'danger'} onClick={this.showModal}>Delete</Button>
                  </ButtonGroup> : null}
              </Col>
            </Row>
          </div>
        </Slider>

        <ConfirmModal
          visible={this.state.modalVisible}
          message={'Are you sure you want to delete this review?'}
          confirmFunc={this.deleteReview}
          confirmText={'Delete'}
          close={this.hideModal} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Review);