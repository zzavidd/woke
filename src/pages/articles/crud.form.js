import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SubmitButton, CancelButton } from '@components/button.js';
import { AuthoredDatePicker } from '@components/datepicker.js';
import {
  Heading,
  Group,
  Label,
  LabelInfo,
  TextInput,
  ShortTextArea,
  LongTextArea,
  FileSelector,
  Select
} from '@components/form.js';
import { Shader, Spacer } from '@components/layout.js';

import { categories } from '@constants/categories.js';
import CLEARANCES from '@constants/clearances.js';
import request from '@constants/request.js';
import { ARTICLE_STATUS } from '@constants/strings.js';

import css from '@styles/pages/Articles.module.scss';

const ArticleForm = ({
  article,
  heading,
  confirmText,
  confirmFunc,
  cancelFunc,
  handlers,
  operation,
  user
}) => {
  if (user.clearance < CLEARANCES.ACTIONS.CRUD_ARTICLES) {
    return (location.href = '/');
  }

  const [isLoaded, setLoaded] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [isDateFieldVisible, setVisibility] = useState(false);

  const { handleText, handleDate, handleFile } = handlers;
  const {
    title,
    content,
    category,
    excerpt,
    image,
    authorId,
    status,
    datePublished,
    tags
  } = article;

  useEffect(() => {
    request({
      url: '/api/v1/members/authors',
      method: 'GET',
      headers: { Authorization: process.env.AUTH_KEY },
      onSuccess: (response) => {
        const authors = response
          .map((author) => {
            return {
              value: author.id,
              label: `${author.firstname} ${author.lastname}`
            };
          })
          .sort((a, b) => {
            a = a.label;
            b = b.label;
            return a < b ? -1 : a > b ? 1 : 0;
          });
        setAuthors(authors);
        setLoaded(true);
      }
    });
  }, [isLoaded]);

  useEffect(() => {
    setVisibility(status === ARTICLE_STATUS.PUBLISHED);
  });

  return (
    <Shader>
      <Spacer className={css.form}>
        <div>
          <Heading>{heading}</Heading>

          <Group>
            <Col md={7}>
              <Label>Title:</Label>
              <TextInput
                name={'title'}
                value={title}
                onChange={handleText}
                placeholder={'Enter the title.'}
              />
            </Col>
            <Col md={5}>
              <Label>Category:</Label>
              <Select
                name={'category'}
                value={category}
                placeholder={'Select a category.'}
                items={categories}
                onChange={handleText}
              />
            </Col>
          </Group>
          <Group>
            <Col>
              <LabelInfo>Content:</LabelInfo>
              <LongTextArea
                name={'content'}
                value={content}
                onChange={handleText}
                placeholder={'Write your thoughts. Express yourself.'}
              />
            </Col>
          </Group>
          <Group>
            <Col>
              <Label>Excerpt:</Label>
              <ShortTextArea
                name={'excerpt'}
                value={excerpt}
                onChange={handleText}
                placeholder={"Enter this article's excerpt."}
              />
            </Col>
          </Group>
          <Group>
            <Col md={6}>
              <Label>Author:</Label>
              <Select
                name={'authorId'}
                value={authorId}
                placeholder={'Select the author.'}
                items={authors}
                onChange={handleText}
              />
            </Col>
            <Col md={{ span: 4, offset: 2 }}>
              <Label>Status:</Label>
              <Select
                name={'status'}
                value={status}
                placeholder={'Select a status.'}
                items={Object.keys(ARTICLE_STATUS).map((key) => key)}
                onChange={handleText}
              />
            </Col>
          </Group>
          <DatePublished
            isDateFieldVisible={isDateFieldVisible}
            datePublished={datePublished}
            handleDate={handleDate}
          />
          <Group>
            <Col>
              <FileSelector
                image={image}
                operation={operation}
                onChange={handleFile}
              />
            </Col>
          </Group>
          <Group>
            <Col>
              <Label>Tags:</Label>
              <ShortTextArea
                name={'tags'}
                value={tags}
                onChange={handleText}
                placeholder={'e.g. woke, society, black women'}
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
};

const DatePublished = ({ isDateFieldVisible, datePublished, handleDate }) => {
  if (!isDateFieldVisible) return null;

  return (
    <Group>
      <Col>
        <Label>Date Published:</Label>
        <AuthoredDatePicker
          name={'datePublished'}
          date={datePublished}
          onConfirm={handleDate}
        />
      </Col>
    </Group>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(ArticleForm);