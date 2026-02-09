import { useState, useEffect } from 'react';
import './App.css';
import LiveMarkdownEditor from './components/LiveMarkdownEditor';

function App() {

  return (
    <main>
      <h1>Collaborative Markdown Editor</h1>
      <LiveMarkdownEditor 
        initialContent="# Welcome to the Live Markdown Editor to move to the next line" 
        onContentChange={(content) => console.log('Content changed:', content)}
      />
    </main>
  )
}

export default App
