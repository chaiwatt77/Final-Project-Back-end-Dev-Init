## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:chaiwatt77/Final-Project-Back-end-Dev-Init.git
    cd the repository
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. Configure your database connection:

    Edit the file at `src/db/dbConnect.ts` to configure your database connection. Here is an example configuration:

    ```typescript
    import mongoose from 'mongoose';

    const connectDB = async () => {
      try {
        await mongoose.connect('mongodb://localhost:27017/your-database-name', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      }
    };

    export default connectDB;
    ```

4. Create your `.env` file:

    In the root directory of the project, create a `.env` file with the following content:

    ```env
    JWT_KEY=YOUR_SECRET_KEY
    ```

    Replace `YOUR_SECRET_KEY` with your actual secret key for JWT.

5. Run the project:

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

