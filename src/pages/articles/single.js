import React, { useEffect, useState, memo } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { connect, useSelector, useDispatch } from 'react-redux';
import { zDate } from 'zavid-modules';

import { alert } from 'components/alert.js';
import { AdminButton, BackButton, SubmitButton } from 'components/button.js';
import { Icon, PromoIconsBar } from 'components/icon.js';
import { CloudinaryImage } from 'components/image.js';
import { Partitioner, Shader, Spacer } from 'components/layout.js';
import { SocialMediaShareBlock } from 'components/socialmedia.js';
import { Title, Subtitle, Paragraph, Divider } from 'components/text.js';
import { BottomToolbar } from 'components/toolbar.js';
import { Fader, Colorizer } from 'components/transitioner.js';
import CLEARANCES from 'constants/clearances.js';
import { checkCookies } from 'constants/cookies';
import request from 'constants/request.js';
import { cloudinary } from 'constants/settings.js';
import { ARTICLE_STATUS } from 'constants/strings';
import ArticleSidebar from 'partials/pages/articles/single.sidebar';
import { incrementClapsOnArticle } from 'reducers/actions';
import css from 'styles/pages/Articles.module.scss';

const clapLimit = 5;
const prohibitedClapMessage =
  'You cannot clap for an article without accepting the cookie policy.';

const ArticlePage = ({ article, user }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [clapCount, setClapCount] = useState(article.claps);
  const [clapCountAnimating, runClapCountAnimation] = useState(false);

  const dispatch = useDispatch();

  const numberOfClapsOnArticle = useSelector(
    (state) => state.articleClapCount[article.id] || 0
  );

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const incrementClapCount = () => {
    // Prohibits clapping if user has not accepted cookie policy.
    if (!checkCookies(prohibitedClapMessage)) return;

    // Prohibit clapping if user has reached limit on claps.
    if (numberOfClapsOnArticle >= clapLimit) {
      alert.info(`You've reached your clap limit on this article, buddy.`);
      return;
    }

    request({
      url: `/api/v1/articles/${article.id}/clap`,
      method: 'PUT',
      headers: { Authorization: process.env.AUTH_KEY },
      onSuccess: ({ claps }) => {
        runClapCountAnimation(true);
        setClapCount(claps);

        dispatch(
          incrementClapsOnArticle({
            [article.id]: numberOfClapsOnArticle + 1
          })
        );
      }
    });
  };

  const {
    authorName,
    authorLevel,
    authorImage,
    authorSlug,
    authorDescription,
    authorSocials,
    datePublished
  } = article;
  article.content = article.content.trim() || 'No content.';

  const shareMessage = `"${article.title}" by ${authorName} on The #WOKEWeekly Blog`;
  const isGuest = authorLevel === 'Guest';
  const link = isGuest ? `/author/${authorSlug}` : `/team/${authorSlug}`;

  /**
   * The blog title element.
   * @returns {React.Component} The component.
   */
  const BlogTitle = () => {
    return (
      <Fader determinant={isLoaded} duration={500}>
        <Subtitle className={css['article-title']}>{article.title}</Subtitle>
      </Fader>
    );
  };

  /**
   * The details of the blog.
   * @returns {React.Component} The component.
   */
  const BlogDetails = () => {
    const date = datePublished && zDate.formatDate(datePublished, { withWeekday: true });
    if (!authorName) return null;

    return (
      <Fader
        determinant={isLoaded}
        duration={500}
        delay={500}
        className={css['article-metadata']}>
        {authorImage ? (
          <CloudinaryImage
            src={authorImage}
            alt={authorName}
            lazy={'ss'}
            className={css['metadata-author-thumbnail']}
          />
        ) : null}
        <Subtitle>
          Written by
          <a className={css['metadata-author-name']} href={link}>
            {' '}
            {authorName}
          </a>
          <br />
          {date ? date : 'Unlisted'}
        </Subtitle>
      </Fader>
    );
  };

  /**
   * The blog's cover image.
   * @returns {React.Component} The component.
   */
  const CoverImage = () => {
    return (
      <Fader determinant={isLoaded} duration={500} delay={750}>
        <CloudinaryImage
          src={article.coverImage}
          alt={article.title}
          className={css['article-image']}
        />
      </Fader>
    );
  };

  /**
   * The content of the blog article.
   * @returns {React.Component} The component.
   */
  const Content = () => {
    let substitutions = {};

    const fillerImages = JSON.parse(article.fillerImages) || [];
    fillerImages
      .filter((e) => e)
      .forEach((image, key) => {
        substitutions[`image${key + 1}`] = `![](${cloudinary.url}/${image})`;
      });

    return (
      <Fader determinant={isLoaded} duration={500} delay={1000}>
        <Paragraph
          className={css['article-content']}
          substitutions={substitutions}>
          {article.content}
        </Paragraph>
      </Fader>
    );
  };

  /**
   * The block containing the article's tags.
   * @returns {React.Component} The component.
   */
  const TagBlock = () => {
    if (!article.tags) return null;
    const tags = JSON.parse(article.tags).map((tag, key) => {
      return <Tag key={key} word={tag} />;
    });

    return <div className={css['article-tag-block']}>{tags}</div>;
  };

  const ReactionBlock = () => {
    if (article.status !== ARTICLE_STATUS.PUBLISHED) return null;

    return (
      <>
        <Title className={css['reaction-heading']}>
          Did You Like This Article?
        </Title>
        <div className={css['reaction-block']}>
          <SubmitButton
            className={css['clap-button']}
            onClick={incrementClapCount}>
            <Icon name={'sign-language'} style={{ fontSize: '1.5rem' }} />
            <span className={css['clap-button-text']}>Clap</span>
          </SubmitButton>
          <Colorizer
            color={'rgba(243, 10, 63, 0.5)'}
            determinant={clapCountAnimating}
            duration={500}
            className={css['clap-count-block']}>
            <Icon name={'heart'} style={{ color: 'red', fontSize: '1.2rem' }} />
            <span className={css['clap-count']}>
              {clapCount} clap{clapCount !== 1 && 's'}
            </span>
          </Colorizer>
        </div>

        <SocialMediaShareBlock message={shareMessage} url={location.href} />
      </>
    );
  };

  /**
   * The author profile.
   * @returns {React.Component} The component.
   */
  const AuthorProfile = () => {
    return (
      <Fader
        determinant={isLoaded}
        duration={500}
        delay={1000}
        className={css['article-author-profile']}>
        <CloudinaryImage
          src={authorImage}
          alt={authorName}
          className={css['author-profile-thumbnail']}
          lazy={'ss'}
        />
        <Subtitle className={css['author-label']}>
          Author • {isGuest ? 'Guest' : 'Member'}
        </Subtitle>
        <Title className={css['author-profile-name']}>{authorName}</Title>
        <PromoIconsBar socials={authorSocials} />
        <Paragraph
          className={css['author-profile-description']}
          truncate={60}
          moretext={`Read more on ${authorName}`}
          moreclass={css['readmore']}
          morelink={link}
          cssOverrides={{
            paragraph: css['override-body']
          }}>
          {authorDescription}
        </Paragraph>
      </Fader>
    );
  };

  return (
    <Spacer>
      <Shader>
        <Partitioner>
          <Row>
            <Col md={8} className={css['column-article']}>
              <Container className={css['article-container']}>
                <BlogTitle />
                <BlogDetails />
                <CoverImage />
                <Content />
                <TagBlock />
                <ReactionBlock />
                <Divider />
                <AuthorProfile />
              </Container>
            </Col>
            <Col md={4} className={css['column-sidebar']}>
              <ArticleSidebar currentArticleId={article.id} />
            </Col>
          </Row>
        </Partitioner>
      </Shader>

      <BottomToolbar>
        <BackButton
          title={'Back to Blog'}
          onClick={() => (location.href = '/blog')}
        />

        {user.clearance >= CLEARANCES.ACTIONS.ARTICLES.MODIFY ? (
          <AdminButton
            title={'Blog Admin'}
            onClick={() => (location.href = '/admin/articles')}
          />
        ) : null}
      </BottomToolbar>
    </Spacer>
  );
};

const Tag = memo(({ word }) => {
  return <span className={css['tag']}>#{word.toUpperCase()}</span>;
});

ArticlePage.getInitialProps = async ({ query }) => {
  return { article: query.article };
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(ArticlePage);
