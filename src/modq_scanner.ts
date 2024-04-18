import { PostReport, PostUpdate, PostCreate, PostFlairUpdate, CommentUpdate, CommentReport} from "@devvit/protos"

import { SettingsFormField, TriggerContext } from "@devvit/public-api";

enum modQScannerSettingName {
    EnableFeature = "enablemodQScanner",
    EnhancedLogging = "enhancedLogging",
}

export const settingsForModQScanner: SettingsFormField = {
    type: "group",
    label: "ModQ Scanner",
    helpText: "Scan the modqueue for reported comments with deleted authors or OPs",
    fields: [
        {
            name: modQScannerSettingName.EnableFeature,
            type: "boolean",
            label: "Enable ModQueue Deleted Comment Clean-up",
            defaultValue: true,
        },
        {
            name: modQScannerSettingName.EnhancedLogging,
            type: "boolean",
            label: "Enhanced Logs",
            defaultValue: false,
        },
  ],
};

export async function checkModQScannerSubmitEvent (event: PostReport | PostUpdate | PostCreate 
                                                        | PostFlairUpdate | CommentUpdate | CommentReport
                                                            , context: TriggerContext)
{

    // Do not do anything if turned off
    if (!modQScannerSettingName.EnableFeature){
        return;
    }

    const settings = await context.settings.getAll();
    const enhancedLogging = settings[modQScannerSettingName.EnhancedLogging] as boolean;

    console.log('\nTriggered by: ' + event.type.toString())

    const subreddit = await context.reddit.getSubredditById(context.subredditId);

    // Comments only
    let modq_comments = await subreddit.getModQueue({ type: 'comment' });
    let modq_comments_count = (await modq_comments.all()).length;

    // If the comment no longer has an OP, delete it
    // If the parent post of the comment no longer has an OP, delete it
    console.log('Comments in ModQ: ' + modq_comments_count);

    for (let i = 0; i < modq_comments.children.length; i++) {

        const comment = modq_comments.children[i];

        if (enhancedLogging){
            console.log('Comment Author: ' + comment.authorName)
        }

        // Remove comment if the author is deleted
        if (comment.authorName === "[deleted]"){
            comment.remove()
            console.log('\tCleared orphaned comment ' + comment.permalink)
        }
        else {            
            // Identify the main post
            let comment_parent_post = await context.reddit.getPostById(comment.postId)

            if (enhancedLogging){
                console.log('Comment Post Author: ' + comment_parent_post.authorName)
            }

            // If the post has the author deleted, delete the comment
            if (comment_parent_post.authorName === "[deleted]") {
                comment.remove()
                console.log('Cleared orphaned comment (post) ' + comment.permalink)
            }
        }
    }

    console.log('Finished.\n\n')

}