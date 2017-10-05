module CopyButton exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Messages exposing (Msg(Grab))


view : List (Attribute Msg) -> List (Html Msg) -> String -> Html Msg
view attributes children val =
  button (attributes ++ [ value val, onClick (Grab val) ]) children
