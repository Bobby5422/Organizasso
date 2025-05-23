import React, { useState } from 'react'
import '../styles/MessageForm.css'

const MessageForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSubmit({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <h2 className="message-form__title">Créer un nouveau message</h2>

      <div className="message-form__fields">
        <input
          type="text"
          className="message-form__input"
          placeholder="Titre"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          className="message-form__textarea"
          placeholder="Contenu"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>

      <div className="message-form__actions">
        <button type="submit">Publier</button>
      </div>
    </form>
  )
}

export default MessageForm
