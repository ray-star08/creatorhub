import { db, TITLES, type DbUser } from "./db";

export interface XpResult {
  gained_xp: number;
  leveled_up: boolean;
  levels_gained: number;
  new_title: string | null;
}

export function addXp(user: DbUser, amount: number): XpResult {
  user.xp += amount;
  user.momentum = Math.min(100, user.momentum + Math.floor(amount / 2));

  let levelsGained = 0;
  let newTitle: string | null = null;

  while (user.xp >= user.next_level_xp) {
    user.xp -= user.next_level_xp;
    user.level++;
    user.next_level_xp = Math.max(1, Math.floor(user.next_level_xp * 1.5));
    levelsGained++;
    newTitle = TITLES[user.level] ?? null;
  }

  if (newTitle) {
    user.title = newTitle;
  }

  user.updated_at = db.now();

  return {
    gained_xp: amount,
    leveled_up: levelsGained > 0,
    levels_gained: levelsGained,
    new_title: newTitle,
  };
}

export function gamificationPayload(user: DbUser) {
  return {
    level: user.level,
    xp: user.xp,
    next_level_xp: user.next_level_xp,
    title: user.title,
    momentum: user.momentum,
    streak: user.streak,
  };
}

export function userPayload(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    ...gamificationPayload(user),
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export function seedStarterQuests(userId: number): void {
  const starters = [
    { title: "Generate 1 Script", xp_reward: 15 },
    { title: "Save 2 Ideas", xp_reward: 10 },
    { title: "Move 1 task to Editing", xp_reward: 20 },
  ];
  const now = db.now();
  for (const q of starters) {
    db.quests.push({
      id: db.autoId(),
      user_id: userId,
      title: q.title,
      xp_reward: q.xp_reward,
      is_completed: false,
      completed_at: null,
      created_at: now,
      updated_at: now,
    });
  }
}