import db from "../data/database.js";
import bcrypt from "bcrypt";
import mongodb from "mongodb";

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  async hasMatchingPassword(hashedPassword) {
    try {
      console.log("Comparing:", this.password, hashedPassword); // 디버깅용 출력
      const result = await bcrypt.compare(this.password, hashedPassword);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: {password: 0}});
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }
}

export default User;
