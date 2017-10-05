module TicketList exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Octicons

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
            [ span [ class "octicon octicon-sm" ] [ branchIcon ] ]
            ticket.fmt.branch
          , copybtn [ class "btn btn-primary btn-sm pq", title "Commit message", tabindex 1 ]
            [ span [ class "octicon octicon-sm" ] [ commitIcon ] ]
            ticket.fmt.commit
          , copybtn [ class "btn btn-primary btn-sm pq", title "CLI command", tabindex 1 ]
            [ span [ class "octicon octicon-sm" ] [ cmdIcon ] ]
            ticket.fmt.cmd
          ]
        ]
      ]
    ]

copybtn = CopyButton.view

branchIcon : Html msg
branchIcon =
  Octicons.gitBranchOptions |> Octicons.color "" |> Octicons.gitBranchIcon

commitIcon : Html msg
commitIcon =
  Octicons.commentOptions |> Octicons.color "" |> Octicons.commentIcon

cmdIcon : Html msg
cmdIcon =
  Octicons.terminalOptions |> Octicons.color "" |> Octicons.terminalIcon
