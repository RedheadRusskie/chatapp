import { ReactNode, createContext, useContext, useReducer } from "react";

interface ConversationState {
  selectedConversationId: string | null;
}

interface ConversationAction {
  type: "SELECT";
  payload: string;
}

const intiialState: ConversationState = {
  selectedConversationId: null,
};

const conversationReducer = (
  state: ConversationState,
  action: ConversationAction
): ConversationState => {
  switch (action.type) {
    case "SELECT":
      return {
        ...state,
        selectedConversationId: action.payload,
      };

    default:
      return state;
  }
};

const ConversationContext = createContext<{
  selectedConversation: ConversationState;
  dispatch: React.Dispatch<ConversationAction>;
}>({
  selectedConversation: intiialState,
  dispatch: () => null,
});

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedConversation, dispatch] = useReducer(
    conversationReducer,
    intiialState
  );

  return (
    <ConversationContext.Provider value={{ selectedConversation, dispatch }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationSelect = () => useContext(ConversationContext);
