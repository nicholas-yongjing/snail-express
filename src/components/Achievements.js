
export default function Achievements(props) {
  const user = props.user;
  const userAchievements = {
    common: [], uncommon: [],
    rare: [], epic: [], legendary: []
  };
  const levelAchievements = {
    1: { title: "Level Up!", description: "Reach level 1", rarity: 'common' },
    5: { title: "Novice", description: "Reach level 5", rarity: 'common' },
    10: { title: "Apprentice", description: "Reach level 10", rarity: 'common' },
    20: { title: "Journeyman", description: "Reach level 20", rarity: 'uncommon' },
    30: { title: "Expert", description: "Reach level 30", rarity: 'uncommon' },
    42: { title: "The Meaning of Life", description: "Reach level 42", rarity: 'uncommon' },
    50: { title: "Mid Point", description: "Reach level 50", rarity: 'rare' },
    64: { title: "Full Stack", description: "Reach level 64", rarity: 'rare' },
    80: { title: "Master", description: "Reach level 80", rarity: 'epic' },
    100: { title: "Maxed Out", description: "Reach level 100", rarity: 'legendary' },
  }
  const postAchievements = {
    1: { title: "Hello World!", description: "Posted in the forums once", rarity: 'common' },
    5: { title: "Requesting Assistance", description: "Posted in the forums 5 times", rarity: 'common' },
    10: { title: "Conversation Starter", description: "Posted in the forums 10 times", rarity: 'common' },
    25: { title: "Initiator", description: "Posted in the forums 25 times", rarity: 'uncommon' },
    50: { title: "Discussion Facilitator", description: "Posted in the forums 50 times", rarity: 'uncommon' },
    100: { title: "Inquisitor", description: "Posted in the forums 100 times", rarity: 'rare' },
    200: { title: "I don't know what I don't know", description: "Posted in the forums 200 times", rarity: 'rare' },
    500: { title: "Consult the Elder Gods", description: "Posted in the forums 500 times", rarity: 'epic' },
    1000: { title: "Pandora's box", description: "Posted in the forums 1000 times", rarity: 'legendary' },
  }
  const replyAchievements = {
    1: { title: "Nice to Meet You Too!", description: "Replied in the forums once", rarity: 'common' },
    5: { title: "Helpful", description: "Replied in the forums 5 times", rarity: 'common' },
    10: { title: "Keyboard Warrior", description: "Replied in the forums 10 times", rarity: 'common' },
    25: { title: "Knowledgeble", description: "Replied in the forums 25 times", rarity: 'uncommon' },
    50: { title: "Logician", description: "Replied in the forums 50 times", rarity: 'uncommon' },
    100: { title: "Tech Support", description: "Replied in the forums 100 times", rarity: 'rare' },
    200: { title: "The Enlightened", description: "Replied in the forums 200 times", rarity: 'rare' },
    500: { title: "Ask and You Snail Receive", description: "Replied in the forums 500 times", rarity: 'epic' },
    1000: { title: "Forum Guardian", description: "Replied in the forums 1000 times", rarity: 'legendary' },
  }
  const voteAchievements = {
    1: { title: "I Agree", description: "Clicked on the vote button once", rarity: 'common' },
    50: { title: "Opinionated", description: "Clicked the vote button 50 times", rarity: 'uncommon' },
    100: { title: "Judgey", description: "Clicked the vote button 100 times", rarity: 'rare' },
    500: { title: "The Critic", description: "Clicked the vote button 500 times", rarity: 'rare' },
    1000: { title: "Democracy", description: "Clicked the vote button 1000 times", rarity: 'epic' },
    10000: { title: "Autoclicker", description: "Clicked the vote button 10000 times", rarity: 'legendary' },
  }
  const quizAchievements = {
    1: {title: "Cart Titan", description: "", rarity: "common"},
    3: {title: "Jaw Titan", description: "", rarity: "common"},
    5: {title: "Colossal Titan", description: "", rarity: "uncommon"},
    7: {title: "Beast Titan", description: "", rarity: "uncommon"},
    9: {title: "Attack Titan", description: "", rarity: "rare"},
    13: {title: "Founding Titan", description: "", rarity: "epic"},
    17: {title: "Teen Titans", description: "", rarity: "legendary"},
  }
  const feedbackAchievements = {
    1: { title: "Once in a Blue Moon", description: "Clicked on the vote button once", rarity: 'common' },
    50: { title: "Low Maintenance", description: "Clicked the vote button 50 times", rarity: 'uncommon' },
    100: { title: "Jitter Clicker", description: "Clicked the vote button 100 times", rarity: 'rare' },
    500: { title: "High Maintenance", description: "Clicked the vote button 500 times", rarity: 'rare' },
    1000: { title: "Candle in the Wind", description: "Clicked the vote button 1000 times", rarity: 'epic' },
    10000: { title: "Infinite Renders", description: "Clicked the vote button 10000 times", rarity: 'legendary' },
  }

  if (user && user.level && user.overallCounts) {
    for (const [userStats, achievements] of
      [[user.level, levelAchievements],
      [user.overallCounts.posts, postAchievements],
      [user.overallCounts.replies, replyAchievements],
      [user.overallCounts.votes, voteAchievements], 
      [user.overallCounts.quizzes, quizAchievements], 
      [user.overallCounts.feedback, feedbackAchievements]]) {
      for (const [requirement, achievement] of Object.entries(achievements)) {
        if (userStats >= requirement) {
          userAchievements[achievement.rarity].push(achievement);
        }
      }
    }
  }

  return (
    <div className="rounded slate-700 p-4 d-flex flex-column gap-4">
      <h3>
        <strong>
          ACHIEVEMENTS
        </strong>
      </h3>
      {
        Object.entries(userAchievements).map(([rarity, achievements]) => {
          return (
            <div key={rarity}>
              <h4>
                <strong>{rarity.toUpperCase()}</strong>
              </h4>
              <div className="d-flex flex-wrap gap-2">
                {
                  achievements.map((achievement) => {
                    return (
                      <div
                        key={achievement.description}
                        className="rounded slate-800 p-2"
                        style={{width: '150px'}}
                      >
                        <h5><strong>{achievement.title}</strong></h5>
                        <div>{achievement.description}</div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
}