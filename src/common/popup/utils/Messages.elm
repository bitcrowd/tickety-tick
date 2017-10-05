module Messages exposing (..)

import Models exposing (Ticket)
import Routes exposing (Route)

type Msg
  = Load (List Ticket)
  | Navigate Route
  | Grab String
  | OpenExt String
