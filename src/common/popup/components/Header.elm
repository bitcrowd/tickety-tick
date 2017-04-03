module Header exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import CopyButton

import Models exposing (Ticket)
import Messages exposing (Msg(Navigate))
import Routes exposing (Route(AboutRoute))


view : List Ticket -> Html Msg
view tickets =
  let
    btn =
      if List.isEmpty tickets then
        text ""
      else
        div []
          [ CopyButton.view [ class "btn btn-secondary btn-sm" ] [ text "Summary" ] (summary tickets)
          , span [ class "nav-text nav-text-sm" ] [ text (label tickets) ]
          ]
  in
    div [ class "navbar navbar-light navbar-fixed-top navbar-tt" ]
      [ ul [ class "nav navbar-nav pull-xs-right" ]
        [ li [ class "nav-item text-xs-right" ]
          [ a [ class "nav-link", href "#about", onClick (Navigate AboutRoute) ] [ text "Info" ]
          ]
        ]
      , btn
      ]

summary : List Ticket -> String
summary tickets =
  tickets
    |> List.map .title -- TODO: Should use format.commit
    |> String.join ", "

label : List Ticket -> String
label tickets =
  let
    length =
      List.length tickets
    suffix =
      if length == 1 then
        "ticket"
      else
        "tickets"
  in
    (toString length) ++ " " ++ suffix
