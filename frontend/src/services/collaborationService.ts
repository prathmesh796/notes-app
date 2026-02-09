// services/collaborationService.ts

// Interface for document operations
export interface DocumentOperation {
  id: string;           // Unique operation ID
  userId: string;       // ID of the user who made the change
  type: 'insert' | 'delete' | 'update'; // Type of operation
  position: number;     // Position in the document where the operation occurred
  text?: string;        // Text involved in the operation (for insert/update)
  length?: number;      // Length of text deleted (for delete operations)
  timestamp: number;    // Timestamp of when the operation occurred
}

// Interface for document state
export interface DocumentState {
  content: string;
  operations: DocumentOperation[];
  version: number;
}

// Basic collaboration service class
class CollaborationService {
  private static instance: CollaborationService;
  private subscribers: Array<(operation: DocumentOperation) => void> = [];
  private documentState: DocumentState = {
    content: '',
    operations: [],
    version: 0
  };
  
  // Operational transform stub - to be implemented later
  private operationalTransformStub = (op1: DocumentOperation, op2: DocumentOperation): [DocumentOperation, DocumentOperation] => {
    // This is a placeholder for the operational transform algorithm
    // In a real implementation, this would adjust operations based on their positions
    // to ensure consistency when multiple users edit simultaneously
    console.log('Operational transform would be applied here');
    return [op1, op2];
  };

  private constructor() {}

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  // Subscribe to document changes
  subscribe(callback: (operation: DocumentOperation) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Apply an operation locally and broadcast it
  applyLocalOperation(operation: DocumentOperation) {
    // Apply the operation to the local document state
    this.applyOperationToLocalState(operation);
    
    // Broadcast the operation to other collaborators
    this.broadcastOperation(operation);
  }

  // Receive an operation from another collaborator
  receiveRemoteOperation(remoteOperation: DocumentOperation) {
    // In a real implementation, we would apply operational transform here
    // to ensure consistency when multiple users edit simultaneously
    this.applyOperationToLocalState(remoteOperation);
  }

  // Apply an operation to the local document state
  private applyOperationToLocalState(operation: DocumentOperation) {
    let newContent = this.documentState.content;
    
    switch (operation.type) {
      case 'insert':
        if (operation.text !== undefined) {
          newContent = 
            newContent.slice(0, operation.position) + 
            operation.text + 
            newContent.slice(operation.position);
        }
        break;
      case 'delete':
        if (operation.length !== undefined) {
          newContent = 
            newContent.slice(0, operation.position) + 
            newContent.slice(operation.position + operation.length);
        }
        break;
      case 'update':
        if (operation.text !== undefined) {
          // For simplicity, treating update as delete + insert
          if (operation.length !== undefined) {
            newContent = 
              newContent.slice(0, operation.position) + 
              newContent.slice(operation.position + operation.length);
          }
          newContent = 
            newContent.slice(0, operation.position) + 
            operation.text + 
            newContent.slice(operation.position);
        }
        break;
    }
    
    // Update the document state
    this.documentState = {
      content: newContent,
      operations: [...this.documentState.operations, operation],
      version: this.documentState.version + 1
    };
  }

  // Broadcast an operation to other collaborators
  private broadcastOperation(operation: DocumentOperation) {
    // In a real implementation, this would send the operation via WebSocket or similar
    console.log('Broadcasting operation:', operation);
    
    // Notify all subscribers of the new operation
    this.subscribers.forEach(callback => callback(operation));
  }

  // Get the current document state
  getDocumentState(): DocumentState {
    return { ...this.documentState };
  }

  // Set the initial document content
  setInitialContent(content: string) {
    this.documentState = {
      content,
      operations: [],
      version: 0
    };
  }
}

export default CollaborationService;