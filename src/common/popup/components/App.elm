module App exposing (..)

import Html exposing (..)

main =
  Html.programWithFlags
    { init = init
    , subscriptions = subscriptions
    , update = update
    , view = view
    }


-- MODEL

type alias Ticket =
  { id : String
  , title : String
  , kind : Maybe String
  }

type alias Flags =
  { tickets : Maybe (List Ticket)
  }

type alias Model =
  { tickets : Maybe (List Ticket)
  }

init : Flags -> (Model, Cmd Msg)
init flags =
  (Model flags.tickets, Cmd.none)


-- UPDATE

type Msg = Load

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  (model, Cmd.none) 


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW

view : Model -> Html Msg
view model =
  div [] [ text "Hello Tickety-Tick" ]
