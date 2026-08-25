import { formatKES, getCurrentTime } from './format';

export function generateWhatsAppMessage(items, tableId, total) {
  let msg = `🔴 NEW ORDER`;
  if (tableId) {
    msg += ` - TABLE #${tableId}`;
  } else {
    msg += ` - TAKEAWAY / DELIVERY`;
  }
  msg += `\n-------------------------\n`;

  items.forEach(item => {
    msg += `${item.quantity}x ${item.name}`;
    if (item.spiceLevel && item.spiceLevel !== 'None') {
      msg += ` (${item.spiceLevel})`;
    }
    msg += `\n`;
    
    if (item.addons && item.addons.length > 0) {
      item.addons.forEach(addon => {
        msg += `   * Added Side: ${addon.name} x${addon.quantity}\n`;
      });
    }
    
    if (item.specialInstructions?.trim()) {
      msg += `   📝 _Note: ${item.specialInstructions.trim()}_\n`;
    }
    msg += `\n`;
  });

  msg += `Total: ${formatKES(total)}\n`;
  msg += `Time: ${getCurrentTime()}\n`;
  msg += `-------------------------\n`;
  msg += `👉 Reply '1' to Confirm Order`;

  return encodeURIComponent(msg);
}
