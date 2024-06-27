import os
from flask import Flask, request, jsonify
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

TOKEN = os.getenv('TELEGRAM_TOKEN')
APP_URL = f'https://{os.getenv("HEROKU_APP_NAME")}.herokuapp.com/{TOKEN}'

engine = create_engine('sqlite:///users.db')
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    telegram_id = Column(Integer, unique=True)
    score = Column(Integer, default=0)
    last_login = Column(Date)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=0)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, this is a web app!'

@app.route(f'/{TOKEN}', methods=['POST'])
def webhook():
    update = Update.de_json(request.get_json(), application.bot)
    application.update_queue.put(update)
    return 'ok'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.message.from_user
    existing_user = session.query(User).filter_by(telegram_id=user.id).first()

    if not existing_user:
        new_user = User(
            username=user.username,
            telegram_id=user.id,
            last_login=datetime.now().date()
        )
        session.add(new_user)
        session.commit()
        await update.message.reply_text(f"Welcome {user.username}! You have started your journey with 0 score.")
    else:
        await update.message.reply_text(f"Welcome back {user.username}! Your current score is {existing_user.score}.")

async def check_in(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.message.from_user
    existing_user = session.query(User).filter_by(telegram_id=user.id).first()

    if existing_user:
        today = datetime.now().date()
        if existing_user.last_login == today:
            await update.message.reply_text("You have already checked in today.")
            return

        if existing_user.last_login == today - timedelta(days=1):
            existing_user.streak += 1
        else:
            existing_user.streak = 1

        existing_user.last_login = today
        existing_user.score += 10 * existing_user.streak  # Example scoring
        session.commit()
        await update.message.reply_text(f"Checked in! Your current streak is {existing_user.streak}. Your score is {existing_user.score}.")
    else:
        await update.message.reply_text("You need to start first. Use /start to register.")

async def invite(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.message.from_user
    invite_link = f"https://t.me/thealphaquest_bot?start={user.id}"
    await update.message.reply_text(f"Invite your friends using this link: {invite_link}")

def main():
    global application
    application = ApplicationBuilder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("checkin", check_in))
    application.add_handler(CommandHandler("invite", invite))

    application.run_webhook(
        listen="0.0.0.0",
        port=int(os.environ.get('PORT', 5000)),
        url_path=TOKEN,
        webhook_url=APP_URL
    )

if __name__ == '__main__':
    main()
