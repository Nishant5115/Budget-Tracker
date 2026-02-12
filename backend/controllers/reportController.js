const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Month and year are required (query params)" });
    }

    const m = Number(month);
    const y = Number(year);
    const userId = req.user._id;

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1);

    const [transactions, budget] = await Promise.all([
      Transaction.find({
        user: userId,
        date: { $gte: startDate, $lt: endDate },
      }).sort({ date: 1 }),
      Budget.findOne({ user: userId, month: m, year: y }),
    ]);

    const totalExpense = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const budgetAmount = budget ? budget.amount : 0;
    const remaining = budgetAmount - totalExpense;
    const percentageUsed =
      budgetAmount > 0
        ? ((totalExpense / budgetAmount) * 100).toFixed(2)
        : 0;

    // Response headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=budget-report-${m}-${y}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);


    doc
      .fontSize(20)
      .fillColor("#111827")
      .text("Budget Tracker", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor("gray")
      .text(
        `Monthly Financial Report — ${startDate.toLocaleString("default", {
          month: "long",
        })} ${y}`,
        { align: "center" }
      )
      .moveDown(2);

    doc.fillColor("black");

 
    doc.fontSize(14).text("Overview", { underline: true });
    doc.moveDown(0.8);

    doc
      .fontSize(12)
      .text(`Monthly Budget: ₹${budgetAmount.toLocaleString()}`)
      .text(`Total Expenses: ₹${totalExpense.toLocaleString()}`)
      .text(`Remaining Budget: ₹${remaining.toLocaleString()}`)
      .text(`Budget Usage: ${percentageUsed}%`)
      .moveDown(1.5);

   
    if (percentageUsed >= 100) {
      doc
        .fillColor("red")
        .fontSize(12)
        .text("⚠️ You have exceeded your monthly budget!")
        .moveDown(1);
    } else if (percentageUsed >= 80) {
      doc
        .fillColor("orange")
        .fontSize(12)
        .text("⚠️ Warning: You have used more than 80% of your budget.")
        .moveDown(1);
    }

    doc.fillColor("black");

    doc.fontSize(14).text("Transactions", { underline: true });
    doc.moveDown(0.8);

    if (!transactions.length) {
      doc.fontSize(12).text("No expenses recorded for this period.");
    } else {
      const tableTop = doc.y;

      doc
        .fontSize(11)
        .text("Date", 50, tableTop)
        .text("Category", 150, tableTop)
        .text("Amount (₹)", 400, tableTop, { align: "right" });

      doc.moveDown(0.5);

      transactions.forEach((t) => {
        const d = new Date(t.date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        doc
          .fontSize(10)
          .text(d, 50)
          .text(t.category || "-", 150)
          .text(`₹${t.amount.toLocaleString()}`, 400, undefined, {
            align: "right",
          });

        doc.moveDown(0.3);
      });
    }

    
    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("gray")
      .text(
        `Generated on ${new Date().toLocaleString("en-IN")}`,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("PDF report error", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  }
};

module.exports = { getMonthlyReport };



