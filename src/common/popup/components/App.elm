module App exposing (..)

import Html exposing (..)

import Models exposing (Ticket)
import Ports exposing (load, grab, openext)
import Messages exposing (Msg(Load, Navigate, Grab, OpenExt))

import Routes exposing (Route(IndexRoute, AboutRoute))
import Loading
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

type alias Model =
  { tickets : Maybe (List Ticket)
  , route : Route
  }

init : (Model, Cmd Msg)
init =
  (Model Nothing IndexRoute, Cmd.none)


-- UPDATE

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Load tickets ->
      ({ model | tickets = Just tickets }, Cmd.none)

    Navigate route ->
      ({ model | route = route }, Cmd.none)

    OpenExt url ->
      (model, openext url)

    Grab text ->
      (model, grab text)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  load Load


-- VIEW

view : Model -> Html Msg
view model =
  case model.tickets of
    Just tickets ->
      case model.route of
        IndexRoute ->
          Index.view tickets

        AboutRoute ->
          About.view

    Nothing ->
      Loading.view
