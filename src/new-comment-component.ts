import { pageAttributes as page } from './page-attributes';
import { User, renderMarkdown } from './github';
import { scheduleMeasure } from './measure';
import { processRenderedMarkdown } from './comment-component';
import { getRepoConfig } from './repo-config';
import { getLoginUrl } from './oauth';

// tslint:disable-next-line:max-line-length
//const anonymousAvatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16" version="1.1"><path fill="rgb(179,179,179)" fill-rule="evenodd" d="M8 10.5L9 14H5l1-3.5L5.25 9h3.5L8 10.5zM10 6H4L2 7h10l-2-1zM9 2L7 3 5 2 4 5h6L9 2zm4.03 7.75L10 9l1 2-2 3h3.22c.45 0 .86-.31.97-.75l.56-2.28c.14-.53-.19-1.08-.72-1.22zM4 9l-3.03.75c-.53.14-.86.69-.72 1.22l.56 2.28c.11.44.52.75.97.75H5l-2-3 1-2z"></path></svg>`;
// base64 encoding works in IE, Edge. UTF-8 does not.
//const anonymousAvatarUrl = `data:image/svg+xml;base64,${btoa(anonymousAvatar)}`;
const anonymousAvatarUrl = `data:image/png;base64,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`;

const nothingToPreview = 'Nothing to preview';

export class NewCommentComponent {
  public readonly element: HTMLElement;

  private avatarAnchor: HTMLAnchorElement;
  private avatar: HTMLImageElement;
  private form: HTMLFormElement;
  private textarea: HTMLTextAreaElement;
  private preview: HTMLDivElement;
  private submitButton: HTMLButtonElement;
  private signInAnchor: HTMLAnchorElement;

  private submitting = false;
  private renderTimeout = 0;

  constructor(
    private user: User | null,
    private readonly submit: (markdown: string) => Promise<void>
  ) {
    this.element = document.createElement('article');
    this.element.classList.add('timeline-comment');

    this.element.innerHTML = `
      <a class="avatar" target="_blank" tabindex="-1">
        <img height="44" width="44">
      </a>
      <form class="comment" accept-charset="UTF-8" action="javascript:">
        <header class="new-comment-header tabnav">
          <nav class="tabnav-tabs" role="tablist">
            <button type="button" class="tabnav-tab tab-write"
                    role="tab" aria-selected="true">
              Write
            </button>
            <button type="button" class="tabnav-tab tab-preview"
                    role="tab">
              Preview
            </button>
          </nav>
        </header>
        <div class="comment-body">
          <textarea class="form-control" placeholder="Leave a comment" aria-label="comment"></textarea>
          <div class="markdown-body" style="display: none">
            ${nothingToPreview}
          </div>
        </div>
        <footer class="new-comment-footer">
          <a class="text-link markdown-info" tabindex="-1" target="_blank"
             href="https://guides.github.com/features/mastering-markdown/">
            <svg class="octicon v-align-bottom" viewBox="0 0 16 16" version="1.1"
              width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15
                13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4
                8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z">
              </path>
            </svg>
            Support Markdown
          </a>
          <button class="btn btn-primary" type="submit">Comment</button>
          <a class="btn btn-primary" href="${getLoginUrl(page.url)}" target="_top">Sign in to comment</a>
        </footer>
      </form>`;

    this.avatarAnchor = this.element.firstElementChild as HTMLAnchorElement;
    this.avatar = this.avatarAnchor.firstElementChild as HTMLImageElement;
    this.form = this.avatarAnchor.nextElementSibling as HTMLFormElement;
    this.textarea = this.form!.firstElementChild!.nextElementSibling!.firstElementChild as HTMLTextAreaElement;
    this.preview = this.form!.firstElementChild!.nextElementSibling!.lastElementChild as HTMLDivElement;
    this.signInAnchor = this.form!.lastElementChild!.lastElementChild! as HTMLAnchorElement;
    this.submitButton = this.signInAnchor.previousElementSibling! as HTMLButtonElement;

    this.setUser(user);
    this.submitButton.disabled = true;

    this.textarea.addEventListener('input', this.handleInput);
    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('click', this.handleClick);
    this.form.addEventListener('keydown', this.handleKeyDown);
    handleTextAreaResize(this.textarea);
  }

  public setUser(user: User | null) {
    this.user = user;
    this.submitButton.hidden = !user;
    this.signInAnchor.hidden = !!user;
    if (user) {
      this.avatarAnchor.href = user.html_url;
      this.avatar.alt = '@' + user.login;
      this.avatar.src = user.avatar_url + '?v=3&s=88';
      this.textarea.disabled = false;
      this.textarea.placeholder = 'Leave a comment';
    } else {
      this.avatarAnchor.removeAttribute('href');
      this.avatar.alt = '@anonymous';
      this.avatar.src = anonymousAvatarUrl;
      this.textarea.disabled = true;
      this.textarea.placeholder = '支持GitHub账号评论';
    }
  }

  public clear() {
    this.textarea.value = '';
  }

  private handleInput = () => {
    getRepoConfig(); // preload repo config
    const text = this.textarea.value;
    const isWhitespace = /^\s*$/.test(text);
    this.submitButton.disabled = isWhitespace;
    if (this.textarea.scrollHeight < 450 && this.textarea.offsetHeight < this.textarea.scrollHeight) {
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      scheduleMeasure();
    }

    clearTimeout(this.renderTimeout);
    if (isWhitespace) {
      this.preview.textContent = nothingToPreview;
    } else {
      this.preview.textContent = 'Loading preview...';
      this.renderTimeout = setTimeout(
        () => renderMarkdown(text).then(html => this.preview.innerHTML = html)
          .then(() => processRenderedMarkdown(this.preview))
          .then(scheduleMeasure),
        500);
    }
  }

  private handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.textarea.disabled = true;
    this.submitButton.disabled = true;
    await this.submit(this.textarea.value).catch(() => 0);
    this.submitting = false;
    this.textarea.disabled = !this.user;
    this.textarea.value = '';
    this.submitButton.disabled = false;
    this.handleClick({ ...event, target: this.form.querySelector('.tabnav-tab.tab-write') });
    this.preview.textContent = nothingToPreview;
  }

  private handleClick = ({ target }: Event) => {
    if (!(target instanceof HTMLButtonElement) || !target.classList.contains('tabnav-tab')) {
      return;
    }
    if (target.getAttribute('aria-selected') === 'true') {
      return;
    }
    this.form.querySelector('.tabnav-tab[aria-selected="true"]')!.setAttribute('aria-selected', 'false');
    target.setAttribute('aria-selected', 'true');
    const isPreview = target.classList.contains('tab-preview');
    this.textarea.style.display = isPreview ? 'none' : '';
    this.preview.style.display = isPreview ? '' : 'none';
    scheduleMeasure();
  }

  private handleKeyDown = ({ which, ctrlKey }: KeyboardEvent) => {
    if (which === 13 && ctrlKey && !this.submitButton.disabled) {
      this.form.dispatchEvent(new CustomEvent('submit'));
    }
  }
}

function handleTextAreaResize(textarea: HTMLTextAreaElement) {
  const stopTracking = () => {
    removeEventListener('mousemove', scheduleMeasure);
    removeEventListener('mouseup', stopTracking);
  };
  const track = () => {
    addEventListener('mousemove', scheduleMeasure);
    addEventListener('mouseup', stopTracking);
  };
  textarea.addEventListener('mousedown', track);
}
