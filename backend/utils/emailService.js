const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's test domain for development
// For production, verify your domain at https://resend.com/domains
const FROM_EMAIL = "onboarding@resend.dev";

// Send bill reminder notification
const sendBillReminderEmail = async (userEmail, userName, billData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `⏰ Bill Reminder: ${billData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Bill Reminder</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>You have an upcoming bill reminder:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Bill Title:</strong> ${billData.title}</p>
              <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${billData.amount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(billData.dueDate).toLocaleDateString("en-IN")}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${billData.category}</p>
              ${billData.description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${billData.description}</p>` : ""}
            </div>
            
            <p>Make sure to pay this bill on time to avoid any penalties.</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Bill reminder email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending bill reminder email to ${userEmail}:`, error);
  }
};

// Send bill payment notification
const sendBillPaymentConfirmationEmail = async (userEmail, userName, billData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `✅ Bill Payment Confirmed: ${billData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Payment Confirmed ✓</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>Your bill payment has been marked as paid:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Bill Title:</strong> ${billData.title}</p>
              <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${billData.amount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${billData.category}</p>
            </div>
            
            <p>Thank you for keeping your bills updated in BudgetTracker!</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Bill payment confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending bill payment confirmation email to ${userEmail}:`, error);
  }
};

// Send savings goal creation notification
const sendSavingsGoalCreatedEmail = async (userEmail, userName, goalData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎯 New Savings Goal Created: ${goalData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">New Savings Goal 🎯</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>Great! You've created a new savings goal:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Goal Title:</strong> ${goalData.title}</p>
              <p style="margin: 5px 0;"><strong>Target Amount:</strong> ₹${goalData.targetAmount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Target Date:</strong> ${new Date(goalData.targetDate).toLocaleDateString("en-IN")}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${goalData.category}</p>
              ${goalData.description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${goalData.description}</p>` : ""}
            </div>
            
            <p>Start saving towards your goal today! Every small step counts towards achieving your financial dreams.</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Savings goal creation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending savings goal creation email to ${userEmail}:`, error);
  }
};

// Send savings goal completion notification
const sendSavingsGoalCompletedEmail = async (userEmail, userName, goalData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎉 Congratulations! Goal Completed: ${goalData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Goal Completed! 🎉</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>Congratulations! You've successfully reached your savings goal! 🌟</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Goal Title:</strong> ${goalData.title}</p>
              <p style="margin: 5px 0;"><strong>Target Amount:</strong> ₹${goalData.targetAmount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Achieved Amount:</strong> ₹${goalData.currentAmount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Completion Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
            </div>
            
            <p>You've shown great discipline and commitment to your financial goals. Keep up the excellent work!</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Savings goal completion email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending savings goal completion email to ${userEmail}:`, error);
  }
};

// Send budget alert email
const sendBudgetAlertEmail = async (userEmail, userName, budgetData, percentageUsed) => {
  try {
    let subject, bgColor, borderColor;
    
    if (percentageUsed >= 100) {
      subject = `⚠️ Budget Alert: Limit Exceeded for ${budgetData.category}`;
      bgColor = "#ef4444";
      borderColor = "#dc2626";
    } else if (percentageUsed >= 80) {
      subject = `⚠️ Budget Alert: ${percentageUsed}% Used for ${budgetData.category}`;
      bgColor = "#f59e0b";
      borderColor = "#d97706";
    } else {
      subject = `📊 Budget Update: ${percentageUsed}% Used for ${budgetData.category}`;
      bgColor = "#3b82f6";
      borderColor = "#1d4ed8";
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${bgColor}, ${bgColor}dd); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Budget Alert</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>Your budget for <strong>${budgetData.category}</strong> has been updated:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid ${borderColor}; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Category:</strong> ${budgetData.category}</p>
              <p style="margin: 5px 0;"><strong>Budget Limit:</strong> ₹${budgetData.limit.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Amount Spent:</strong> ₹${budgetData.spent.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Remaining:</strong> ₹${Math.max(budgetData.limit - budgetData.spent, 0).toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Usage:</strong> ${percentageUsed}%</p>
              
              <div style="background: #e5e7eb; height: 20px; border-radius: 10px; margin-top: 10px; overflow: hidden;">
                <div style="background: ${borderColor}; height: 100%; width: ${Math.min(percentageUsed, 100)}%; transition: width 0.3s ease;"></div>
              </div>
            </div>
            
            ${percentageUsed >= 80 ? "<p style='color: #ef4444; font-weight: bold;'>⚠️ You are approaching or have exceeded your budget limit. Please review your spending!</p>" : "<p>Keep tracking your spending to stay within your budget.</p>"}
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Budget alert email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending budget alert email to ${userEmail}:`, error);
  }
};

// Send transaction notification email
const sendTransactionNotificationEmail = async (userEmail, userName, transactionData) => {
  try {
    const transactionType = transactionData.type === "income" ? "Income" : "Expense";
    const bgColor = transactionData.type === "income" ? "#10b981" : "#ef4444";
    const icon = transactionData.type === "income" ? "💰" : "💸";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `${icon} Transaction Recorded: ${transactionType} - ₹${transactionData.amount.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${bgColor}, ${bgColor}dd); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">${transactionType} Recorded ${icon}</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>A new ${transactionType.toLowerCase()} transaction has been recorded:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid ${bgColor}; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Type:</strong> ${transactionType}</p>
              <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${transactionData.amount.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${transactionData.category}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(transactionData.date).toLocaleDateString("en-IN")}</p>
              ${transactionData.description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${transactionData.description}</p>` : ""}
            </div>
            
            <p>Keep monitoring your finances with BudgetTracker!</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Transaction notification email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending transaction notification email to ${userEmail}:`, error);
  }
};

// Send budget confirmation email
const sendBudgetConfirmationEmail = async (userEmail, userName, budgetData) => {
  try {
    const monthYear = new Date(budgetData.year, budgetData.month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `💰 Budget Set for ${monthYear}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Budget Confirmation</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Hey ${userName},</p>
            
            <p>Your monthly budget has been set:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Month:</strong> ${monthYear}</p>
              <p style="margin: 5px 0;"><strong>Budget Amount:</strong> ₹${budgetData.amount.toFixed(2)}</p>
            </div>
            
            <p>Monitor your spending throughout the month to stay within your budget!</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 12px;">This is an automated notification from BudgetTracker. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(`✅ Budget confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending budget confirmation email to ${userEmail}:`, error);
  }
};

module.exports = {
  sendBillReminderEmail,
  sendBillPaymentConfirmationEmail,
  sendSavingsGoalCreatedEmail,
  sendSavingsGoalCompletedEmail,
  sendBudgetAlertEmail,
  sendTransactionNotificationEmail,
  sendBudgetConfirmationEmail,
};
