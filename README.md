# LegalAdviceUK (lauk) bot

Written for specific functions required for LegalAdviceUK.

## ModQ Scanner

Scans the modqueue regularly, looking for reported comments to analyse.

- If the comment has a deleted OP, the comment is removed.

- If the main post of the reported comment is deleted, then the comment is also removed.

### Trigger

The bot scans regularly, and is triggered by normal subreddit activity. It does **not** scan whenever a new comment is made on the sub, but will scan for other activities such as mod actions, new post submissions, flair updates, and various other natural subreddit activities.

### Configuration

#### Enable Toggle

The feature can be disabled at any time through the toggle in the app settings.

#### There is no other configuration required.