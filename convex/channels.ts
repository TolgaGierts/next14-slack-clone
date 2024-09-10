import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const channels = await ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspaceId))
      .collect();

    return channels;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, { name, workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User not found');
    }
    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', workspaceId).eq('userId', userId)
      )
      .unique();
    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const parsedName = name.replace(/\s/g, '-').toLowerCase();

    const channelId = await ctx.db.insert('channels', {
      name: parsedName,
      workspaceId,
    });

    return channelId;
  },
});

export const update = mutation({
  args: {
    id: v.id('channels'),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User not found');
    }

    const channel = await ctx.db.get(id);
    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const parsedName = name.replace(/\s/g, '-').toLowerCase();

    await ctx.db.patch(id, { name: parsedName });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User not found');
    }

    const channel = await ctx.db.get(id);
    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const [messages] = await Promise.all([
      ctx.db
        .query('messages')
        .withIndex('by_channel_id', (q) => q.eq('channelId', id))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(id);

    return id;
  },
});

export const getById = query({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(id);
    if (!channel) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return channel;
  },
});
