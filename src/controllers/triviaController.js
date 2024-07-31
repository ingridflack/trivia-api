import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import TriviaModel from "../models/Trivia.js";
import TriviaItemModel from "../models/TriviaItem.js";

class TriviaController {
  static async createTrivia(req, res) {
    try {
      console.log({ headers: req.headers.authorization });

      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      const decodedToken = jsonwebtoken.decode(token, {
        complete: true,
      });

      const userId = decodedToken.payload.id;
      console.log({ userId });

      const { amount, category, difficulty, type } = req.body;

      const url = new URL("https://opentdb.com/api.php");
      url.searchParams.append("amount", amount);
      url.searchParams.append("category", category);
      url.searchParams.append("difficulty", difficulty);
      url.searchParams.append("type", type);

      const { data } = await axios.get(url);
      console.log({ data });

      const trivia = await TriviaModel.create({ userId });
      console.log({ trivia });

      const triviaItems = await TriviaItemModel.bulkWrite(
        data.results.map((item) => ({
          insertOne: {
            document: {
              triviaId: trivia._id,
              question: item.question,
              category: item.category,
              difficulty: item.difficulty,
            },
          },
        }))
      );
      console.log({ triviaItems });

      //   res.status(200).json(data);
      res.status(200).json({
        message: "Trivia created successfully",
        trivia,
        triviaItems: data.results,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default TriviaController;
