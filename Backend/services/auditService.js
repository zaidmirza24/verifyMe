import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async (actorId, action, targetId = null, targetModel = null, meta = {}) => {
  await AuditLog.create({
    actor: actorId,
    action,
    target: targetId,
    targetModel,
    meta
  });
};
