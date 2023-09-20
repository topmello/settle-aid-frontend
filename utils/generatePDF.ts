import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Route, RouteResult } from "../types/route";

const generatePDF = async (route: Route | RouteResult) => {
  try {
    const locations = route.locations
      .map((location) => `<p>${location}</p>`)
      .join("");

    const instructions = route.instructions
      .map((instruction) => `<p>${instruction}</p>`)
      .join("");

    const cssContent = `
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f4f4f4;
            color: #333;
        }
        h1 {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
        }
        h2 {
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        p {
            margin: 10px 0;
            line-height: 1.6;
            font-size: 16px;
        }
        </style>
        `;
    const htmlContent = `
    <html>
      <head>${cssContent}</head>
      <body>
        <h1>My Events</h1>
        <h2>Locations</h2>
        ${locations} 
        <h2>Instructions</h2>
        ${instructions}
      </body>
    </html>
    `;

    // Generate PDF using expo-print
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Open the generated PDF using expo-sharing
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share PDF",
      UTI: "com.adobe.pdf",
    });

    console.log("PDF saved and opened:", uri);
  } catch (error) {
    console.error("Error generating and opening PDF:", error);
  }
};

export default generatePDF;
