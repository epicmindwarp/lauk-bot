import { Devvit } from '@devvit/public-api';
import { settingsForModQScanner, checkModQScannerSubmitEvent } from "./modq_scanner.js";

Devvit.configure({
  redditAPI: true, // <-- this allows you to interact with Reddit's data api
});

Devvit.addSettings([
  settingsForModQScanner
]);

Devvit.addTrigger({
  events: ['PostReport', 'PostUpdate', 'PostCreate', 'PostFlairUpdate', 'CommentUpdate', 'CommentReport'],
  onEvent: checkModQScannerSubmitEvent,
});

export default Devvit;