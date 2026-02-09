import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import CollaborationService from '../services/collaborationService';

interface DocumentOperation {
  id: string;           // Unique operation ID
  userId: string;       // ID of the user who made the change
  type: 'insert' | 'delete' | 'update'; // Type of operation
  position: number;     // Position in the document where the operation occurred
  text?: string;        // Text involved in the operation (for insert/update)
  length?: number;      // Length of text deleted (for delete operations)
  timestamp: number;    // Timestamp of when the operation occurred
}

interface LiveMarkdownEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  userId?: string;
}

const LiveMarkdownEditor: React.FC<LiveMarkdownEditorProps> = ({ 
  initialContent = '', 
  onContentChange,
  userId = 'user1'
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const collaborationService = CollaborationService.getInstance();
  const textareaRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  // Initialize the collaboration service
  useEffect(() => {
    collaborationService.setInitialContent(initialContent);
    
    const unsubscribe = collaborationService.subscribe((operation: DocumentOperation) => {
      collaborationService.receiveRemoteOperation(operation);
      const newState = collaborationService.getDocumentState();
      setContent(newState.content);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Split content into lines for individual editing
  const lines = content.split('\n');

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Create an operation for the collaboration service
    const operation: DocumentOperation = {
      id: Date.now().toString(),
      userId: userId,
      type: 'update',
      position: 0, // Simplified - in a real implementation, this would track actual position
      text: newContent,
      length: content.length,
      timestamp: Date.now()
    };
    
    // Apply the operation locally and broadcast it
    collaborationService.applyLocalOperation(operation);
    
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // Start editing a specific line
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(lines[index]);
  };

  // Save the edited line
  const saveEdit = (index: number) => {
    if (editingIndex === index) {
      const newLines = [...lines];
      newLines[index] = editValue;
      const newContent = newLines.join('\n');
      handleContentChange(newContent);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  // Handle key events in the edit textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      saveEdit(index);
      
      // Move to next line or create a new one
      setTimeout(() => {
        if (index + 1 < lines.length) {
          startEditing(index + 1);
        } else {
          // Add a new line
          const newContent = content + '\n';
          handleContentChange(newContent);
          
          // Start editing the new line after a brief delay
          setTimeout(() => {
            startEditing(lines.length);
          }, 10);
        }
      }, 10);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    } else if (e.key === 'ArrowUp' && index > 0) {
      saveEdit(index);
      startEditing(index - 1);
    } else if (e.key === 'ArrowDown' && index < lines.length - 1) {
      saveEdit(index);
      startEditing(index + 1);
    }
  };

  // Render a line either as editable textarea or as markdown
  const renderLine = (line: string, index: number) => {
    if (editingIndex === index) {
      return (
        <textarea
          ref={el => textareaRefs.current[index] = el}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={() => saveEdit(index)}
          autoFocus
          className="live-edit-textarea"
        />
      );
    } else {
      return (
        <div 
          onClick={() => startEditing(index)}
          className="preview-line"
        >
          <ReactMarkdown>{line}</ReactMarkdown>
        </div>
      );
    }
  };

  return (
    <div className="live-markdown-editor">
      <div className="editor-header">
        <span>Live Markdown Editor (Click to edit)</span>
      </div>
      <div className="editor-content">
        {lines.map((line, index) => (
          <div key={index} className="line-container">
            {renderLine(line, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMarkdownEditor;