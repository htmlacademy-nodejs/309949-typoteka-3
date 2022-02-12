'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const MAX_LATEST_COMMENTS = 4;

  const createCommentElement = (comment) => {
    const commentTemplate = document.querySelector('#comment-template');
    const latestCommentElement = commentTemplate.cloneNode(true).content;

    if (comment.user.avatar) {
      latestCommentElement.querySelector('.last__list-image').src = `/img/${comment.user.avatar}`;
    } else {
      latestCommentElement.querySelector('.last__list-image').remove();
    }
    latestCommentElement
      .querySelector('.last__list-name').textContent = `${comment.user.firstName} ${comment.user.lastName}`
    latestCommentElement.querySelector('.last__list-link').href = `articles/${comment.articleId}`;
    latestCommentElement.querySelector('.last__list-link').textContent = comment.text;

    return latestCommentElement;
  };

  const updateCommentElements = (comment) => {
    const commentsWrapper = document.querySelector('.last__list');
    const commentElements = commentsWrapper.querySelectorAll('.last__list-item');

    if (commentElements.length === MAX_LATEST_COMMENTS) {
      commentElements[commentElements.length - 1].remove();
    }

    commentsWrapper.prepend(createCommentElement(comment));
  }

  const createHotArticleElement = (article) => {
    const hotArticleTemplate = document.querySelector('#article-template');
    const hotArticleElement = hotArticleTemplate.cloneNode(true).content;
    const hotArticleLink = hotArticleElement.querySelector('.hot__list-link')
    hotArticleLink.querySelector('span').textContent = article.announce
    hotArticleLink.href = `articles/${article.id}`;
    hotArticleLink.querySelector('.hot__link-sup').textContent = article.commentsCount;

    return hotArticleElement;
  }

  const updateHotArticles = (hotArticles) => {
    const hotArticlesWrapper = document.querySelector('.hot__list');
    const hotArticlesElements = hotArticlesWrapper.querySelectorAll('.hot__list-item');
    for (const article of hotArticlesElements) {
      article.remove()
    }

    for (const newArticle of hotArticles) {
      hotArticlesWrapper.append(createHotArticleElement(newArticle));
    }
  }

  socket.addEventListener(`comment:create`, (comment) => {
    updateCommentElements(comment)
  })

  socket.addEventListener(`hotArticles:update`, (hotArticles) => {
    updateHotArticles(hotArticles)
  })
})();
