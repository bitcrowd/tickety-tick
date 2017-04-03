module TicketList exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import CopyButton

import Models exposing (Ticket)
import Messages exposing (Msg)


view : List Ticket -> Html Msg
view tickets =
  ul [ class "list-group" ] (List.map item tickets)

item : Ticket -> Html Msg
item ticket =
  li [ class "list-group-item list-group-item-tt" ]
    [ div [ class "container list-group-container" ]
      [ div [ class "row" ]
        [ div [ class "col-xs-7" ]
            [ h6 [ class "list-group-heading" ] [ text ticket.title ]
            ]
        , div [ class "col-xs-5 text-xs-right" ]
          [ copybtn [ class "btn btn-primary btn-sm", title "Branch name", tabindex 1 ]
            [ span [ class "octicon octicon-sm" ] [ text "git-branch svg" ] ] -- dangerouslySetInnerHTML {svg('git-branch')}
            "branch" -- TODO: fmt {branch}
          , copybtn [ class "btn btn-primary btn-sm pq", title "Commit message", tabindex 1 ]
            [ span [ class "octicon octicon-sm" ] [ text "comment svg" ] ] -- dangerouslySetInnerHTML {svg('comment')}
            "commit" -- TODO: fmt {commit}
          , copybtn [ class "btn btn-primary btn-sm pq", title "CLI command", tabindex 1 ]
            [ span [ class "octicon octicon-sm" ] [ text "terminal svg" ] ]
            "command" -- TODO: fmt command
          ]
        ]
      ]
    ]

copybtn = CopyButton.view
