module Index exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Models exposing (Ticket)
import Messages exposing (Msg)

import Header
import NoTickets
import TicketList


view : List Ticket -> Html Msg
view tickets =
  let
    content =
      if List.isEmpty tickets then
        NoTickets.view
      else
        TicketList.view tickets
  in
    div []
      [ Header.view tickets
      , div [ class "content" ] [ content ]
      ]
