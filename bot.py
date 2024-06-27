import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext, CallbackQueryHandler
from flask import Flask, request
from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean
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

@app.route(f'/{TOKEN}', methods=['POST'])
def webhook():
    update = Update.de_json(request.get_json(), updater.bot)
    dp.process_update(update)
    return 'ok'

def start(update: Update, context: CallbackContext) -> None:
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
        update.message.reply_text(f"Welcome {user.username}! You have started your journey with 0 score.")
    else:
        update.message.reply_text(f"Welcome back {user.username}! Your current score is {existing_user.score}.")

def check_in(update: Update, context: CallbackContext) -> None:
    user = update.message.from_user
    existing_user = session.query(User).filter_by(telegram_id=user.id).first()

    if existing_user:
        today = datetime.now().date()
        if existing_user.last_login == today:
            update.message.reply_text("You have already checked in today.")
            return

        if existing_user.last_login == today - timedelta(days=1):
            existing_user.streak += 1
        else:
            existing_user.streak = 1

        existing_user.last_login = today
        existing_user.score += 10 * existing_user.streak  # Example scoring
        session.commit()
        update.message.reply_text(f"Checked in! Your current streak is {existing_user.streak}. Your score is {existing_user.score}.")
    else:
        update.message.reply_text("You need to start first. Use /start to register.")

def invite(update: Update, context: CallbackContext) -> None:
    user = update.message.from_user
    invite_link = f"https://t.me/thealphaquest_bot?start={user.id}"
    update.message.reply_text(f"Invite your friends using this link: {invite_link}")

def main():
    global updater, dp
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("checkin", check_in))
    dp.add_handler(CommandHandler("invite", invite))

    updater.start_webhook(listen="0.0.0.0", port=int(os.environ.get('PORT', 5000)), url_path=TOKEN)
    updater.bot.setWebhook(APP_URL)
    updater.idle()

if __name__ == '__main__':
    main()
b