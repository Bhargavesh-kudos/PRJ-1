/**
 * ============================================================================
 * FILE: users/backend/controllers/adminTicketsController.js
 * PURPOSE: SuperAdmin Support Ticket Resolution Controller.
 * ============================================================================
 */

import { readDB, saveDB, addActivityLog } from "../config/db.js";

/**
 * POST /api/admin/tickets/:id/reply
 * Saves the SuperAdmin's reply to a user support ticket and marks it Resolved.
 */
export function replySupportTicket(req, res) {
  const { id } = req.params;
  const { adminReply, status } = req.body;

  const db = readDB();
  const ticket = db.supportTickets.find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).json({ success: false, message: "Ticket not found." });
  }

  if (adminReply !== undefined) ticket.adminReply = adminReply;
  if (status) ticket.status = status;

  saveDB(db);
  addActivityLog(
    req.user.id,
    req.user.email,
    "TICKET_RESOLVED",
    `Replied to support ticket ${ticket.id}`
  );

  return res.json({
    success: true,
    message: `Ticket ${ticket.id} updated and marked as ${ticket.status}.`,
    ticket
  });
}
