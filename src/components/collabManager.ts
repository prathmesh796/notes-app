import { CollabService } from '@milkdown/plugin-collab';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const wsUrl = 'wss://demos.yjs.dev/ws';

const markdown = `
# Milkdown Vanilla Collab

> You're scared of a world where you're needed.

---

Now you can play!
`;

// User names and colors for awareness
const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
const options = names.map(name => ({
  name,
  color: `#${randomColor()}`
}));

// Dynamically create the UI inside the given area element
function createArea(area: HTMLElement) {
  const templateForm = document.createElement('div');
  templateForm.classList.add('template-form');
  area.appendChild(templateForm);

  const textarea = document.createElement('textarea');
  textarea.classList.add('template');
  textarea.cols = 50;
  textarea.rows = 2;
  textarea.placeholder = 'Input some markdown here to apply template';
  templateForm.appendChild(textarea);

  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  templateForm.appendChild(applyButton);

  const room = document.createElement('div');
  room.classList.add('room');
  area.appendChild(room);

  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Switch Room';
  room.appendChild(toggleButton);

  const roomDisplay = document.createElement('span');
  room.appendChild(roomDisplay);

  const roomValue = document.createElement('span');
  roomDisplay.appendChild(document.createTextNode('Room: '));
  roomDisplay.appendChild(roomValue);

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');
  area.appendChild(buttonGroup);

  const connectButton = document.createElement('button');
  connectButton.textContent = 'Connect';
  buttonGroup.appendChild(connectButton);

  const disconnectButton = document.createElement('button');
  disconnectButton.textContent = 'Disconnect';
  buttonGroup.appendChild(disconnectButton);

  const status = document.createElement('span');
  status.classList.add('status');
  buttonGroup.appendChild(status);

  const statusValue = document.createElement('span');
  status.appendChild(document.createTextNode('Status: '));
  status.appendChild(statusValue);

  return {
    textarea,
    applyButton,
    toggleButton,
    room: roomValue,
    connectButton,
    disconnectButton,
    status: statusValue,
  };
}

export default class CollabManager {
  private room = 'milkdown';
  private doc!: Doc;
  private wsProvider!: WebsocketProvider;
  doms: ReturnType<typeof createArea>;

  constructor(
    private collabService: CollabService,
    private area: HTMLElement,
    private rndInt = Math.floor(Math.random() * options.length),
  ) {
    this.doms = createArea(this.area);
    this.doms.room.textContent = this.room;

    // Setup button event listeners
    this.doms.connectButton.onclick = () => this.connect();
    this.doms.disconnectButton.onclick = () => this.disconnect();
    this.doms.applyButton.onclick = () => this.applyTemplate(this.doms.textarea.value);
    this.doms.toggleButton.onclick = () => this.toggleRoom();
  }

  flush(template: string) {
    this.doc?.destroy();
    this.wsProvider?.destroy();

    this.doc = new Doc();
    this.wsProvider = new WebsocketProvider(wsUrl, this.room, this.doc, { connect: true });
    this.wsProvider.awareness.setLocalStateField('user', options[this.rndInt]);

    this.wsProvider.on('status', ({ status }) => {
      this.doms.status.textContent = status;
    });

    this.collabService.bindDoc(this.doc).setAwareness(this.wsProvider.awareness);

    this.wsProvider.once('sync', (isSynced: boolean) => {
      if (isSynced) {
        this.collabService.applyTemplate(template).connect();
      }
    });
  }

  connect() {
    this.wsProvider.connect();
    this.collabService.connect();
  }

  disconnect() {
    this.collabService.disconnect();
    this.wsProvider.disconnect();
  }

  applyTemplate(template: string) {
    this.collabService.disconnect().applyTemplate(template, () => true).connect();
  }

  toggleRoom() {
    this.room = this.room === 'milkdown' ? 'milkdown-sandbox' : 'milkdown';
    this.doms.room.textContent = this.room;

    const template = this.room === 'milkdown' ? markdown : '# Sandbox Room';
    this.disconnect();
    this.flush(template);
  }
}
