module App exposing (..)

import Html exposing (..)
import Html.Events exposing (..)

import Models exposing (Ticket)
import Ports exposing (load, grab, openext)

import Index
import About


main =
  Html.program
    { init = init
    , subscriptions = subscriptions
    , update = update
    , view = view
    }


-- MODEL

type Page
  = Index
  | About

type alias Model =
  { tickets : Maybe (List Ticket)
  , page : Page
  }

init : (Model, Cmd Msg)
init =
  (Model Nothing Index, Cmd.none)


-- UPDATE

type Msg
  = Load (List Ticket)
  | Navigate Page

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Load tickets ->
      ({ model | tickets = Just tickets }, Cmd.none)

    Navigate page ->
      ({ model | page = page }, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  load Load


-- VIEW

view : Model -> Html Msg
view model =
  case model.tickets of
    Just tickets ->
      case model.page of
        Index ->
          Index.view tickets

        About ->
          About.view

    Nothing ->
      div [] [ text "loading" ]
