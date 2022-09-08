import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // console.log("123245")
    const conn = await mongoose.connect(process.env.DB_CONNECT, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB