port module App exposing (..)

import Html exposing (..)
import Html.Events exposing (..)

import Models exposing (Ticket)
import Ports exposing (load, grab, openext)

main =
  Html.program
    { init = init
    , subscriptions = subscriptions
    , update = update
    , view = view
    }


-- MODEL

type alias Model =
  { tickets : Maybe (List Ticket)
  }

init : (Model, Cmd Msg)
init =
  (Model Nothing, Cmd.none)


-- UPDATE

type Msg
  = Load (List Ticket)
  | OpenGitHub

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Load tickets ->
      ({ model | tickets = Just tickets }, Cmd.none)

    OpenGitHub ->
      (model, grab "https://github.com/bitcrowd/tickety-tick")


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  load Load


-- VIEW

ticketListItem : Ticket -> Html Msg
ticketListItem ticket =
  li []
    [ h6 [] [ text ticket.title ]
    ]

view : Model -> Html Msg
view model =
  case model.tickets of
    Just tickets ->
      ul [] (List.map ticketListItem tickets)

    Nothing ->
      div [] [ text "loading" ]

    -- div []
    --   [ text "Hello Tickety-Tick"
    --   , button [ onClick OpenGitHub ] [ text "Copy GitHub URL" ]
    --   , ul [] (List.map ticketListItem tickets)
    --   ]
