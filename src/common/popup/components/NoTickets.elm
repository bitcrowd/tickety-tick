module NoTickets exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)


view : Html msg
view =
  div [ class "text-xs-center m-b-2" ] 
    [ h5 [ class "m-t-2 m-b-2" ] [ text "No tickets found on this page." ]
    , h6 [] [ text "Did you select or open any tickets?" ]
    , p []
      [ text "Tickety-Tick currently supports"
      , br [] []
      , text "GitHub, Jira, Pivotal and Trello."
      ]
    , h6 [] [ text "Missing anything or found a bug?" ]
    , p [] [ a [] [ text "Report an issue" ] ]
    ]
