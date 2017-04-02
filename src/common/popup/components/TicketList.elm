module TicketList exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Models exposing (Ticket)


view : List Ticket -> Html msg
view tickets =
  ul [ class "list-group" ] (List.map item tickets)

item : Ticket -> Html msg
item ticket =
  li [ class "list-group-item list-group-item-tt" ]
    [ div [ class "container list-group-container" ]
      [ div [ class "row" ]
        [ div [ class "col-xs-7" ]
            [ h6 [ class "list-group-heading" ] [ text ticket.title ]
            ]
        , div [ class "col-xs-5 text-xs-right" ]
          [ button [ class "btn btn-primary btn-sm", title "Branch name", value "branch", tabindex 1 ] -- value = fmt {branch}
            [ span [ class "octicon octicon-sm" ] [ text "git-branch svg" ] ] -- dangerouslySetInnerHTML {svg('git-branch')}
          , button [ class "btn btn-primary btn-sm pq", title "Commit message", value "commit", tabindex 1 ] -- value = fmt {commit}
            [ span [ class "octicon octicon-sm" ] [ text "comment svg" ] ] -- dangerouslySetInnerHTML {svg('comment')}
          , button [ class "btn btn-primary btn-sm pq", title "CLI command", value "command", tabindex 1 ] -- value fmt command
            [ span [ class "octicon octicon-sm" ] [ text "terminal svg" ] ]
          ]
        ]
      ]
    ]
