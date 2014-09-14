(ns state.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(def app-state (atom {:name "Om"}))

(defn hello-react [app owner]
    (om/component
       (dom/div nil
          (dom/input #js {:onClick (fn [e] (swap! app assoc :name e.target.value)) :value (:name app)} nil)
          (dom/h1 nil (str "Hello " (:name app) "!")))))

(om/root
  hello-react
  app-state
  {:target (. js/document (getElementById "app"))})
