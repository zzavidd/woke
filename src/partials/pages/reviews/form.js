import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SubmitButton, CancelButton } from 'components/button.js';
import {
  Heading,
  Group,
  Label,
  LabelInfo,
  TextInput,
  LongTextArea,
  FileSelector
} from 'components/form';
import { Shader, Spacer } from 'components/layout.js';
import Rator from 'components/rator.js';
import CLEARANCES from 'constants/clearances.js';
import css from 'styles/pages/Members.module.scss';

class ReviewForm extends Component {
  constructor(props) {
    super(props);

    if (props.user.clearance < CLEARANCES.ACTIONS.REVIEWS.MODIFY) {
      return (location.href = '/reviews');
    }
  }

  render() {
    const {
      heading,
      entity,
      confirmText,
      confirmFunc,
      cancelFunc,
      handlers,
      operation
    } = this.props;
    const { handleText, handleFile, handleRatingChange } = handlers;
    const { referee, position, rating, description, image } = entity;

    return (
      <Shader>
        <Spacer className={css.form}>
          <div>
            <Heading>{heading}</Heading>

            <Group>
              <Col md={6}>
                <Label>Referee:</Label>
                <TextInput
                  name={'referee'}
                  value={referee}
                  onChange={handleText}
                  placeholder={"Enter referee's name."}
                />
              </Col>
              <Col md={6}>
                <Label>Position:</Label>
                <TextInput
                  name={'position'}
                  value={position}
                  onChange={handleText}
                  placeholder={"Enter referee's position."}
                />
              </Col>
            </Group>
            <Group>
              <Col>
                <Label>Rating:</Label>
                <Rator
                  rating={rating}
                  changeable={true}
                  onChange={handleRatingChange}
                />
              </Col>
            </Group>
            <Group>
              <Col>
                <LabelInfo>Description:</LabelInfo>
                <LongTextArea
                  name={'description'}
                  value={description}
                  onChange={handleText}
                  placeholder={"Write out the referee's review..."}
                />
              </Col>
            </Group>
            <Group>
              <Col>
                <FileSelector
                  image={image}
                  operation={operation}
                  onChange={handleFile}
                />
              </Col>
            </Group>
          </div>

          <div>
            <Group>
              <Col>
                <SubmitButton onClick={confirmFunc} className={'mr-2'}>
                  {confirmText}
                </SubmitButton>
                <CancelButton onClick={cancelFunc}>Cancel</CancelButton>
              </Col>
            </Group>
          </div>
        </Spacer>
      </Shader>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(ReviewForm);
